# dashboard/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path("dashboard/admin/", views.admin_dashboard, name="admin_dashboard"),
    path("dashboard/user/<str:user_id>/", views.user_dashboard, name="user_dashboard"),
]

# dashboard/views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from bson import ObjectId
from datetime import datetime, timedelta
import calendar

from database.monogdb import (
    user_collection, 
    customer_collection, 
    plan_collection, 
    subscription_collection,
    invoice_collection,
    transaction_collection,
    ticket_collection,
    network_status_collection
)


@api_view(["GET"])
@permission_classes([AllowAny])
def admin_dashboard(request):
    """
    Get statistics and data for the admin dashboard
    """
    # Calculate total revenue
    total_revenue = 0
    revenue_pipeline = [
        {"$match": {"status": "paid"}},
        {"$group": {"_id": None, "total": {"$sum": "$amount"}}}
    ]
    revenue_result = list(invoice_collection.aggregate(revenue_pipeline))
    if revenue_result:
        total_revenue = revenue_result[0]["total"]
    
    # Calculate revenue growth
    # Compare current month with previous month
    now = datetime.utcnow()
    current_month_start = datetime(now.year, now.month, 1)
    
    # Calculate previous month date range
    if now.month == 1:
        prev_month = 12
        prev_year = now.year - 1
    else:
        prev_month = now.month - 1
        prev_year = now.year
    
    prev_month_start = datetime(prev_year, prev_month, 1)
    prev_month_end = current_month_start - timedelta(days=1)
    
    # Current month revenue
    current_month_pipeline = [
        {"$match": {
            "status": "paid",
            "paidDate": {"$gte": current_month_start}
        }},
        {"$group": {"_id": None, "total": {"$sum": "$amount"}}}
    ]
    current_result = list(invoice_collection.aggregate(current_month_pipeline))
    current_month_revenue = current_result[0]["total"] if current_result else 0
    
    # Previous month revenue
    prev_month_pipeline = [
        {"$match": {
            "status": "paid",
            "paidDate": {
                "$gte": prev_month_start,
                "$lt": current_month_start
            }
        }},
        {"$group": {"_id": None, "total": {"$sum": "$amount"}}}
    ]
    prev_result = list(invoice_collection.aggregate(prev_month_pipeline))
    prev_month_revenue = prev_result[0]["total"] if prev_result else 0
    
    # Calculate growth percentage
    revenue_growth = 0
    if prev_month_revenue > 0:
        revenue_growth = round(((current_month_revenue - prev_month_revenue) / prev_month_revenue) * 100, 1)
    
    # Count active plans (active subscriptions)
    active_plans = subscription_collection.count_documents({"status": "active"})
    
    # Calculate retention rate (simplified)
    # Percentage of subscriptions that are renewed
    retention_pipeline = [
        {"$match": {"autoRenew": True}},
        {"$count": "renewed"}
    ]
    renewed = list(subscription_collection.aggregate(retention_pipeline))
    total_subs = subscription_collection.count_documents({})
    
    retention_rate = 0
    if total_subs > 0 and renewed:
        retention_rate = round((renewed[0]["renewed"] / total_subs) * 100)
    
    # Get server status (simplified - using network status)
    server_status = 99.99  # Default
    outages = network_status_collection.count_documents({"status": "outage"})
    if outages > 0:
        server_status = 95.00  # Simplified - just an example
    
    # Count security alerts (using high/critical severity audit logs)
    security_alerts = 0
    last_week = datetime.utcnow() - timedelta(days=7)
    security_pipeline = [
        {"$match": {
            "severity": {"$in": ["high", "critical"]},
            "timestamp": {"$gte": last_week}
        }},
        {"$count": "alerts"}
    ]
    
    # Sample system health data
    # In a real system, this would come from monitoring tools
    system_health = {
        "cpuLoad": 42,
        "memoryUsage": 68,
        "diskSpace": 78
    }
    
    # User growth data - last 6 months
    months = []
    user_counts = []
    
    current_month = now.month
    current_year = now.year
    
    for i in range(6):
        if current_month - i <= 0:
            month = current_month - i + 12
            year = current_year - 1
        else:
            month = current_month - i
            year = current_year
        
        month_name = calendar.month_abbr[month]
        months.insert(0, month_name)
        
        # Get count of users created in that month
        month_start = datetime(year, month, 1)
        if month == 12:
            next_month_start = datetime(year + 1, 1, 1)
        else:
            next_month_start = datetime(year, month + 1, 1)
        
        count = customer_collection.count_documents({
            "createdAt": {
                "$gte": month_start,
                "$lt": next_month_start
            }
        })
        
        user_counts.insert(0, count)
    
    # Revenue by region (simplified example)
    # In a real system, this would be calculated from customer data with regions
    regions = ["North", "South", "East", "West", "Central"]
    region_data = [85600, 63400, 42000, 31800, 26163]  # Example data
    
    # Combine all data
    response_data = {
        "totalRevenue": total_revenue,
        "revenueGrowth": revenue_growth,
        "activePlans": active_plans,
        "retentionRate": retention_rate,
        "serverStatus": server_status,
        "securityAlerts": security_alerts,
        "systemHealth": system_health,
        "userGrowth": {
            "labels": months,
            "data": user_counts
        },
        "revenueByRegion": {
            "labels": regions,
            "data": region_data
        }
    }
    
    return Response({"stats": response_data}, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([AllowAny])
def user_dashboard(request, user_id):
    """
    Get statistics and data for a specific user's dashboard
    """
    try:
        customer_oid = ObjectId(user_id)
    except:
        return Response({"error": "Invalid user ID format"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Get the customer
    customer = customer_collection.find_one({"_id": customer_oid})
    if not customer:
        return Response({"error": "Customer not found"}, status=status.HTTP_404_NOT_FOUND)
    
    # Get the customer's current plan information
    current_plan_info = {
        "name": "No active plan",
        "endDate": None,
        "data": {"used": 0, "total": 0},
        "calls": {"used": 0, "total": 0},
        "sms": {"used": 0, "total": 0}
    }
    
    if customer.get("currentPlan") and customer["currentPlan"].get("planId"):
        plan_id = customer["currentPlan"]["planId"]
        plan = plan_collection.find_one({"_id": plan_id})
        
        if plan:
            current_plan_info["name"] = plan["name"]
            current_plan_info["endDate"] = customer["currentPlan"].get("endDate")
            
            # In a real system, usage data would be tracked separately
            # This is simplified example data
            current_plan_info["data"] = {
                "used": round(plan["features"]["data"] * 0.65, 1),  # Simulated 65% usage
                "total": plan["features"]["data"]
            }
            current_plan_info["calls"] = {
                "used": round(plan["features"]["calls"] * 0.4),  # Simulated 40% usage
                "total": plan["features"]["calls"]
            }
            current_plan_info["sms"] = {
                "used": round(plan["features"]["sms"] * 0.25),  # Simulated 25% usage
                "total": plan["features"]["sms"]
            }
    
    # Internet speed (from plan or default)
    internet_speed = 0
    if customer.get("currentPlan") and customer["currentPlan"].get("planId"):
        plan_id = customer["currentPlan"]["planId"]
        plan = plan_collection.find_one({"_id": plan_id})
        if plan and plan.get("features") and plan["features"].get("speed"):
            internet_speed = plan["features"]["speed"]
    
    # Count active devices (simplified - would come from actual device tracking)
    active_devices = 3  # Default example
    
    # Get next bill information
    next_bill = {
        "amount": 0,
        "dueDate": None
    }
    
    # Get unpaid invoices
    unpaid_invoice = invoice_collection.find_one({
        "customerId": customer_oid,
        "status": "unpaid"
    }, sort=[("dueDate", 1)])
    
    if unpaid_invoice:
        next_bill["amount"] = unpaid_invoice["amount"]
        next_bill["dueDate"] = unpaid_invoice["dueDate"]
    elif customer.get("currentPlan") and customer["currentPlan"].get("planId"):
        # If no unpaid invoice but has active plan, get plan price
        plan_id = customer["currentPlan"]["planId"]
        plan = plan_collection.find_one({"_id": plan_id})
        if plan:
            next_bill["amount"] = plan["price"]
            
            # Calculate next due date based on end date
            if customer["currentPlan"].get("endDate"):
                next_bill["dueDate"] = customer["currentPlan"]["endDate"]
    
    # Recent activity (last 3 events)
    recent_activity = []
    
    # Check usage alerts (simplified example)
    data_percent = 0
    if current_plan_info["data"]["total"] > 0:
        data_percent = int((current_plan_info["data"]["used"] / current_plan_info["data"]["total"]) * 100)
    
    if data_percent >= 80:
        recent_activity.append({
            "type": "dataUsage",
            "description": f"{data_percent}% of data quota used",
            "timestamp": datetime.utcnow() - timedelta(days=1)
        })
    
    # Get recent payment
    recent_payment = transaction_collection.find_one(
        {"customerId": customer_oid, "type": "payment"},
        sort=[("date", -1)]
    )
    if recent_payment:
        recent_activity.append({
            "type": "payment",
            "description": "Monthly plan renewed",
            "timestamp": recent_payment["date"]
        })
    
    # Check for recent support tickets
    recent_ticket = ticket_collection.find_one(
        {"customerId": customer_oid, "status": "resolved"},
        sort=[("resolvedAt", -1)]
    )
    if recent_ticket:
        recent_activity.append({
            "type": "support",
            "description": f"Ticket #{recent_ticket['ticketId']} closed",
            "timestamp": recent_ticket["resolvedAt"] or recent_ticket["updatedAt"]
        })
    
    # Sort activity by timestamp (most recent first) and limit to 3
    recent_activity.sort(key=lambda x: x["timestamp"], reverse=True)
    recent_activity = recent_activity[:3]
    
    # Response data
    response_data = {
        "currentPlan": current_plan_info,
        "internetSpeed": internet_speed,
        "activeDevices": active_devices,
        "nextBill": next_bill,
        "recentActivity": recent_activity
    }
    
    return Response({"stats": response_data}, status=status.HTTP_200_OK)