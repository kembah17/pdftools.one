/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://pdftools.one',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  outDir: './out',
  changefreq: 'weekly',
  priority: 0.7,
  transform: async (config, path) => {
    // Homepage gets highest priority
    if (path === '/' || path === '') {
      return { loc: path, changefreq: 'daily', priority: 1.0, lastmod: new Date().toISOString() };
    }
    // Legal/info pages get lowest priority
    if (['/about', '/privacy', '/terms', '/about/', '/privacy/', '/terms/'].includes(path)) {
      return { loc: path, changefreq: 'monthly', priority: 0.3, lastmod: new Date().toISOString() };
    }
    // Tool pages get high priority
    return { loc: path, changefreq: 'weekly', priority: 0.8, lastmod: new Date().toISOString() };
  },
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }],
  },
};
