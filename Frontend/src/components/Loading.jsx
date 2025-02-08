import React from 'react';

function Loading() {
    return (
        <div className='flex h-screen items-center justify-center bg-gray-300'>
            <div className="flex w-52 flex-col gap-4">
                <div className="flex items-center gap-4">
                    <div className="h-16 w-16 shrink-0 rounded-full bg-gray-200 animate-pulse"></div>
                    <div className="flex flex-col gap-4">
                        <div className="h-4 w-20 bg-gray-200 animate-pulse"></div>
                        <div className="h-4 w-28 bg-gray-200 animate-pulse"></div>
                    </div>
                </div>
                <div className="h-32 w-full bg-gray-200 animate-pulse"></div>
            </div>
        </div>
    );
}

export default Loading;
