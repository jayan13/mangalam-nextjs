export default function NewsListSkeleton() {
    return (
        <div className="animate-pulse space-y-8">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="mid-block border-b pb-8">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="w-full md:w-2/3">
                            <div className="h-64 bg-gray-200 rounded mb-4"></div>
                            <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                        </div>
                        <div className="w-full md:w-1/3 space-y-4">
                            {[...Array(3)].map((_, j) => (
                                <div key={j} className="flex gap-2">
                                    <div className="flex-1 h-6 bg-gray-200 rounded"></div>
                                    <div className="w-20 h-12 bg-gray-200 rounded"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
