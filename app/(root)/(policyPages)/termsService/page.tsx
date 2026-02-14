import React from 'react'
import termsData from './content.json'

const TermsServicePage = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 p-8 mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        {termsData.title}
                    </h1>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-zinc-400">
                        <span className="px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full font-medium">
                            Last updated: {termsData.lastUpdated}
                        </span>
                    </div>
                    <p className="mt-6 text-lg text-gray-600 dark:text-zinc-300 leading-relaxed italic">
                        {termsData.introduction}
                    </p>
                </div>

                {/* Content Sections */}
                <div className="space-y-8">
                    {termsData.sections.map((section) => (
                        <section
                            key={section.id}
                            id={section.id}
                            className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 p-8 transition-all hover:shadow-md"
                        >
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                                <span className="h-2 w-2 bg-emerald-500 rounded-full"></span>
                                {section.title}
                            </h2>

                            <div className="space-y-6">
                                {section.content.map((item, index) => {
                                    switch (item.type) {
                                        case 'heading':
                                            const headingClassName = "text-xl font-semibold text-gray-800 dark:text-zinc-200 mt-8 first:mt-0";
                                            if (item.level === 3) return <h3 key={index} className={headingClassName}>{item.text}</h3>;
                                            if (item.level === 2) return <h2 key={index} className={headingClassName}>{item.text}</h2>;
                                            return <h4 key={index} className={headingClassName}>{item.text}</h4>;
                                        case 'paragraph':
                                            return (
                                                <p
                                                    key={index}
                                                    className="text-gray-600 dark:text-zinc-400 leading-relaxed"
                                                >
                                                    {item.text}
                                                </p>
                                            );
                                        case 'list':
                                            return (
                                                <div key={index} className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2 mt-4">
                                                    {item.items?.map((listItem, listIndex) => (
                                                        <div
                                                            key={listIndex}
                                                            className="p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-xl border border-gray-100 dark:border-zinc-800 group hover:border-emerald-200 dark:hover:border-emerald-500/30 transition-colors"
                                                        >
                                                            <div className="font-bold text-emerald-600 dark:text-emerald-400 mb-1 group-hover:translate-x-1 transition-transform inline-block">
                                                                {listItem.term}
                                                            </div>
                                                            <p className="text-sm text-gray-600 dark:text-zinc-400">
                                                                {listItem.definition}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            );
                                        default:
                                            return null;
                                    }
                                })}
                            </div>
                        </section>
                    ))}
                </div>

                {/* Footer Note */}
                <div className="mt-12 text-center text-gray-500 dark:text-zinc-500 text-sm">
                    <p>© {new Date().getFullYear()} Swasthify. All rights reserved.</p>
                </div>
            </div>
        </div>
    )
}

export default TermsServicePage