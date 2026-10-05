import React, { useState } from 'react';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { BLOG_ARTICLES, BLOG_CATEGORIES, type BlogCategory } from '@/data/blogArticles';
import { useI18n } from '@/i18n';
import { Clock, Calendar, ArrowRight, Search, BookOpen } from 'lucide-react';

export default function BlogIndex() {
  const { c, market } = useI18n();
  const t = c.ui.pages.blog;
  const [selectedCat, setSelectedCat] = useState<'all' | BlogCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = BLOG_ARTICLES.filter((art) => {
    if (selectedCat !== 'all' && art.category !== selectedCat) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return art.title.toLowerCase().includes(q) || art.excerpt.toLowerCase().includes(q);
    }
    return true;
  });

  const categories: ('all' | BlogCategory)[] = ['all', ...BLOG_CATEGORIES];

  return (
    <Layout
      title={t.meta.title(market.brand)}
      description={t.meta.description}
    >
      <div className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-primary dark:text-accent-glow bg-primary/10 dark:bg-primary/20 px-3.5 py-1.5 rounded-full border border-primary/30">
              {t.eyebrow}
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-navy dark:text-white tracking-tight">
              {t.h1}
            </h1>
            <p className="text-base sm:text-lg text-navy/70 dark:text-gray-300">
              {t.intro}
            </p>

            {/* Search */}
            <div className="pt-4 max-w-md mx-auto">
              <div className="relative">
                <Search className="w-4 h-4 text-navy/40 dark:text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-[#161F2B] border border-gray-200 dark:border-navy-light/60 text-navy dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                />
              </div>
            </div>

            {/* Category tabs */}
            <div className="pt-3 flex flex-wrap items-center justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCat(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    selectedCat === cat
                      ? 'bg-primary text-navy font-bold'
                      : 'bg-gray-100 dark:bg-navy-light/40 text-navy/70 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-navy-light'
                  }`}
                >
                  {cat === 'all' ? t.all : t.categories[cat]}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of Articles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((art) => (
              <article
                key={art.slug}
                className="rounded-2xl border border-gray-200 dark:border-navy-light/60 bg-white dark:bg-[#161F2B] overflow-hidden shadow-sm hover:shadow-brand transition-all flex flex-col justify-between group"
              >
                <div className="p-7 space-y-4">
                  <div className="flex items-center justify-between text-xs text-navy/60 dark:text-gray-400">
                    <span className="px-2.5 py-1 rounded-full font-semibold bg-primary/10 text-primary dark:text-accent-glow border border-primary/20">
                      {t.categories[art.category]}
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5" /> {art.readTime}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-navy dark:text-white group-hover:text-primary dark:group-hover:text-accent-glow transition-colors leading-snug">
                    <Link href={`/blog/${art.slug}`}>{art.title}</Link>
                  </h2>

                  <p className="text-xs sm:text-sm text-navy/70 dark:text-gray-400 leading-relaxed">
                    {art.excerpt}
                  </p>
                </div>

                <div className="px-7 py-4 bg-gray-50/70 dark:bg-[#111722]/60 border-t border-gray-100 dark:border-navy-light/30 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-navy dark:text-white">{art.author.name}</div>
                    <div className="text-navy/50 dark:text-gray-400 text-[11px]">{art.date}</div>
                  </div>
                  <Link
                    href={`/blog/${art.slug}`}
                    className="inline-flex items-center gap-1 font-bold text-primary dark:text-accent-glow hover:underline"
                  >
                    <span>{t.read}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

        </div>
      </div>
    </Layout>
  );
}
