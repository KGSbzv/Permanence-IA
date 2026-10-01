import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { BLOG_ARTICLES, BlogArticle } from '@/data/blogArticles';
import { ArrowLeft, Clock, Calendar, Share2, Sparkles, ArrowRight } from 'lucide-react';

export default function ArticleDetail() {
  const router = useRouter();
  const { slug } = router.query;

  const article = BLOG_ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    return (
      <Layout title="Article non trouvé | Permanence IA">
        <div className="py-24 text-center max-w-xl mx-auto space-y-4">
          <h1 className="text-3xl font-extrabold text-navy dark:text-white">Article introuvable</h1>
          <p className="text-sm text-navy/70 dark:text-gray-400">L&apos;article que vous cherchez n&apos;existe pas ou a été déplacé.</p>
          <Link href="/blog" className="inline-flex items-center gap-2 text-primary font-bold hover:underline">
            <ArrowLeft className="w-4 h-4" /> Retour aux articles
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      title={`${article.title} | Blog Permanence IA`}
      description={article.excerpt}
    >
      <article className="py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-semibold text-navy/60 dark:text-gray-400 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Retour à la liste des articles
          </Link>

          {/* Meta Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-xs">
              <span className="px-3 py-1 rounded-full font-bold bg-primary/10 text-primary dark:text-accent-glow border border-primary/20">
                {article.category}
              </span>
              <span className="flex items-center gap-1 text-navy/60 dark:text-gray-400 font-mono">
                <Clock className="w-3.5 h-3.5" /> {article.readTime} de lecture
              </span>
              <span className="text-navy/40 dark:text-gray-500">&bull;</span>
              <span className="text-navy/60 dark:text-gray-400">{article.date}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy dark:text-white tracking-tight leading-tight">
              {article.title}
            </h1>

            {/* Author bar */}
            <div className="pt-4 flex items-center justify-between border-y border-gray-100 dark:border-navy-light/40 py-4 text-xs">
              <div>
                <div className="font-bold text-navy dark:text-white">{article.author.name}</div>
                <div className="text-navy/60 dark:text-gray-400">{article.author.role}</div>
              </div>
              <div className="text-navy/50 dark:text-gray-400">Permanence IA Publications</div>
            </div>
          </div>

          {/* Body Content */}
          <div className="space-y-6 text-base sm:text-lg text-navy/85 dark:text-gray-300 leading-relaxed">
            {article.content.map((paragraph, idx) => (
              <p key={idx} className="leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Inline CTA Box */}
          <div className="my-12 p-8 rounded-2xl bg-gradient-to-r from-navy to-[#111722] text-white border border-primary/30 shadow-brand space-y-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary uppercase">
              <Sparkles className="w-3.5 h-3.5" /> Passez à l&apos;action
            </div>
            <h3 className="text-2xl font-extrabold">Prêt à équiper votre entreprise d&apos;un standard IA ?</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Testez dès aujourd&apos;hui notre agent vocal en conditions réelles pendant 7 jours sans engagement.
            </p>
            <div className="pt-2">
              <Link
                href="/essai-gratuit"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-[#3dbbb2] text-navy font-bold text-sm shadow transition-all"
              >
                <span>Démarrer l&apos;essai gratuit</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

        </div>
      </article>
    </Layout>
  );
}
