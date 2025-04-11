import React, { useState, useEffect } from 'react';
import { X, Activity, Download, Upload, Clock } from 'lucide-react';

const SpeedTestPopup = ({ isOpen, onClose }) => {
  const [testStatus, setTestStatus] = useState('idle'); // idle, testing, completed
  const [results, setResults] = useState({
    download: 0,
    upload: 0,
    ping: 0
  });
  
  useEffect(() => {
    if (isOpen && testStatus === 'idle') {
      // Reset results when opening
      setResults({
        download: 0,
        upload: 0,
        ping: 0
      });
    }
  }, [isOpen]);
  
  const startTest = () => {
    setTestStatus('testing');
    
    // Simulate ping test
    setTimeout(() => {
      setResults(prev => ({ ...prev, ping: 24 }));
      
      // Simulate download test
      let downloadProgress = 0;
      const downloadInterval = setInterval(() => {
        downloadProgress += 10;
        setResults(prev => ({ ...prev, download: downloadProgress }));
        
        if (downloadProgress >= 85) {
          clearInterval(downloadInterval);
          
          // Simulate upload test
          let uploadProgress = 0;
          const uploadInterval = setInterval(() => {
            uploadProgress += 8;
            setResults(prev => ({ ...prev, upload: uploadProgress }));
            
            if (uploadProgress >= 72) {
              clearInterval(uploadInterval);
              setTestStatus('completed');
            }
          }, 200);
        }
      }, 200);
    }, 1000);
  };
  
  const resetTest = () => {
    setTestStatus('idle');
    setResults({
      download: 0,
      upload: 0,
      ping: 0
    });
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center">
            <Activity className="h-5 w-5 text-purple-600 mr-2" />
            <h3 className="text-lg font-semibold">Network Speed Test</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {testStatus === 'idle' && (
            <div className="text-center">
              <div className="bg-purple-100 p-4 rounded-full inline-flex mb-4">
                <Activity className="h-12 w-12 text-purple-600" />
              </div>
              <h4 className="text-xl font-medium mb-2">Ready to Test Your Connection</h4>
              <p className="text-gray-600 mb-6">
                This will measure your network's download speed, upload speed, and ping response time.
              </p>
              <button 
                onClick={startTest} 
                className="bg-purple-600 text-white px-6 py-3 rounded-md font-medium w-full"
              >
                Start Test
              </button>
            </div>
          )}
          
          {testStatus === 'testing' && (
            <div className="text-center">
              <div className="animate-pulse mb-4">
                <Activity className="h-12 w-12 text-purple-600 mx-auto" />
              </div>
              <h4 className="text-xl font-medium mb-4">Testing Your Connection...</h4>
              
              <div className="space-y-4 mb-6">
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" /> Ping
                    </span>
                    <span>{results.ping > 0 ? `${results.ping} ms` : 'Testing...'}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-500 transition-all duration-500"
                      style={{ width: results.ping > 0 ? '100%' : '0%' }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span className="flex items-center">
                      <Download className="h-4 w-4 mr-1" /> Download
                    </span>
                    <span>{results.download > 0 ? `${results.download.toFixed(1)} Mbps` : 'Waiting...'}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-500"
                      style={{ width: `${(results.download / 100) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span className="flex items-center">
                      <Upload className="h-4 w-4 mr-1" /> Upload
                    </span>
                    <span>{results.upload > 0 ? `${results.upload.toFixed(1)} Mbps` : 'Waiting...'}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-500 transition-all duration-500"
                      style={{ width: `${(results.upload / 100) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-500 text-sm">Please don't close this window during the test</p>
            </div>
          )}
          
          {testStatus === 'completed' && (
            <div>
              <div className="text-center mb-6">
                <div className="bg-green-100 p-4 rounded-full inline-flex mb-4">
                  <CheckIcon className="h-10 w-10 text-green-600" />
                </div>
                <h4 className="text-xl font-medium mb-2">Test Completed</h4>
                <p className="text-gray-600">
                  Here are your network performance results
                </p>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <Clock className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{results.ping}</div>
                  <div className="text-xs text-gray-500">ms Ping</div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <Download className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{results.download.toFixed(1)}</div>
                  <div className="text-xs text-gray-500">Mbps Download</div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <Upload className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{results.upload.toFixed(1)}</div>
                  <div className="text-xs text-gray-500">Mbps Upload</div>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={resetTest} 
                  className="bg-purple-600 text-white px-4 py-2 rounded-md font-medium flex-1"
                >
                  Test Again
                </button>
                <button 
                  onClick={onClose} 
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md font-medium flex-1"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// CheckIcon Component for completed state
const CheckIcon = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    className={className} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export default SpeedTestPopup;