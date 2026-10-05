/** Catégorie d’article : clé stable, libellé traduit dans c.ui.pages.blog.categories. */
export type BlogCategory = 'productivite' | 'conformite' | 'cas-client' | 'technique';
export const BLOG_CATEGORIES: BlogCategory[] = ['productivite', 'conformite', 'cas-client', 'technique'];

export interface BlogArticle {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  readTime: string;
  date: string;
  author: { name: string; role: string };
  content: string[];
}

// Aucun article publié : ne pas ajouter de contenu ou de cas client non vérifié.
export const BLOG_ARTICLES: BlogArticle[] = [];
