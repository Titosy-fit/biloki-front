// resources/js/components/Skeleton.tsx
export function TableSkeleton() {
    return (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden animate-pulse">
            <div className="bg-slate-800 border-b border-slate-700 p-4">
                <div className="h-4 bg-slate-700 rounded w-1/4"></div>
            </div>
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="p-4 border-b border-slate-700/50">
                    <div className="flex gap-4">
                        <div className="h-4 bg-slate-700 rounded w-1/4"></div>
                        <div className="h-4 bg-slate-700 rounded w-1/6"></div>
                        <div className="h-4 bg-slate-700 rounded w-1/6"></div>
                        <div className="h-4 bg-slate-700 rounded w-1/6"></div>
                        <div className="h-4 bg-slate-700 rounded w-1/6"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export function CardSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 animate-pulse">
                    <div className="flex justify-between">
                        <div>
                            <div className="h-3 bg-slate-700 rounded w-20 mb-2"></div>
                            <div className="h-8 bg-slate-700 rounded w-24"></div>
                        </div>
                        <div className="w-12 h-12 bg-slate-700 rounded-xl"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export function ProductGridSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 animate-pulse">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-slate-700 rounded-full"></div>
                        <div className="flex-1">
                            <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-slate-700 rounded w-1/2"></div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-3 bg-slate-700 rounded w-full"></div>
                        <div className="h-3 bg-slate-700 rounded w-2/3"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}