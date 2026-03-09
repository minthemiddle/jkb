#!/usr/bin/env node

/**
 * Comprehensive Sitemap Validator
 * Checks syntax, structure, and content of sitemap.xml files
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
};

class SitemapValidator {
  constructor(sitemapPath) {
    this.sitemapPath = sitemapPath;
    this.errors = [];
    this.warnings = [];
    this.passed = 0;
    this.failed = 0;
  }

  validate() {
    console.log(`${colors.blue}═══════════════════════════════════════════════════════════${colors.reset}`);
    console.log(`${colors.blue}  SITEMAP.XML VALIDATOR${colors.reset}`);
    console.log(`${colors.blue}═══════════════════════════════════════════════════════════${colors.reset}\n`);

    // Read and parse sitemap
    const content = this.readFile();
    if (!content) return false;

    const xml = this.parseXML(content);
    if (!xml) return false;

    // Run all validation checks
    this.checkStructure(xml);
    this.checkURLs(xml);
    this.checkPriorities(xml);
    this.checkChangeFrequencies(xml);
    this.checkLastModDates(xml);
    this.checkDuplicates(xml);
    this.checkFileExistence(xml);

    // Print results
    this.printResults();

    return this.failed === 0;
  }

  readFile() {
    try {
      if (!fs.existsSync(this.sitemapPath)) {
        this.error('File not found', this.sitemapPath);
        return null;
      }
      return fs.readFileSync(this.sitemapPath, 'utf8');
    } catch (err) {
      this.error('Failed to read file', err.message);
      return null;
    }
  }

  parseXML(content) {
    try {
      // Simple XML parser for sitemaps
      const urls = [];
      const urlRegex = /<url>\s*<loc>([^<]+)<\/loc>(?:\s*<lastmod>([^<]+)<\/lastmod>)?(?:\s*<changefreq>([^<]+)<\/changefreq>)?(?:\s*<priority>([^<]+)<\/priority>)?\s*<\/url>/g;

      let match;
      while ((match = urlRegex.exec(content)) !== null) {
        urls.push({
          loc: match[1],
          lastmod: match[2] || null,
          changefreq: match[3] || null,
          priority: match[4] || null
        });
      }

      if (urls.length === 0) {
        this.error('No URLs found in sitemap', 'The sitemap appears to be empty or malformed');
        return null;
      }

      return { urls };
    } catch (err) {
      this.error('Failed to parse XML', err.message);
      return null;
    }
  }

  checkStructure(xml) {
    console.log(`${colors.blue}📋 Checking structure...${colors.reset}`);

    // Check if root element is correct
    const content = fs.readFileSync(this.sitemapPath, 'utf8');
    if (!content.includes('<urlset') || !content.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"')) {
      this.error('Invalid root element', 'Missing proper urlset with sitemap namespace');
    } else {
      this.pass('Valid root element with correct namespace');
    }

    // Check XML declaration
    if (!content.startsWith('<?xml version="1.0" encoding="UTF-8"?>')) {
      this.warning('Missing or invalid XML declaration');
    } else {
      this.pass('Valid XML declaration');
    }

    console.log('');
  }

  checkURLs(xml) {
    console.log(`${colors.blue}🔗 Checking URLs...${colors.reset}`);

    const urlPattern = /^https?:\/\/[\w\-\._~:\/?#\[\]@!\$&'\(\)\*\+,;=]+$/;

    xml.urls.forEach((url, index) => {
      if (!url.loc) {
        this.error(`URL ${index + 1}: Missing <loc> element`);
        return;
      }

      if (!urlPattern.test(url.loc)) {
        this.error(`URL ${index + 1}: Invalid URL format`, url.loc);
      } else {
        this.pass(`Valid URL: ${this.truncateURL(url.loc)}`);
      }

      // Check for common issues
      if (url.loc.includes('  ')) {
        this.warning(`URL ${index + 1}: Contains double spaces`, url.loc);
      }
    });

    console.log('');
  }

  checkPriorities(xml) {
    console.log(`${colors.blue}⭐ Checking priorities...${colors.reset}`);

    xml.urls.forEach((url, index) => {
      if (url.priority === null) {
        this.warning(`URL ${index + 1}: Missing priority (defaults to 0.5)`);
        return;
      }

      const priority = parseFloat(url.priority);
      if (isNaN(priority) || priority < 0 || priority > 1) {
        this.error(`URL ${index + 1}: Invalid priority value`, url.priority);
      } else {
        this.pass(`Valid priority (${url.priority}): ${this.truncateURL(url.loc)}`);
      }
    });

    // Check for priority logic
    const priorities = xml.urls.map(u => parseFloat(u.priority)).filter(p => !isNaN(p));
    if (priorities.length > 0) {
      const maxPriority = Math.max(...priorities);
      if (maxPriority < 0.8) {
        this.warning('No page has priority >= 0.8', 'Consider setting homepage to 1.0');
      }
    }

    console.log('');
  }

  checkChangeFrequencies(xml) {
    console.log(`${colors.blue}🔄 Checking change frequencies...${colors.reset}`);

    const validFreqs = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];

    xml.urls.forEach((url, index) => {
      if (url.changefreq === null) {
        this.warning(`URL ${index + 1}: Missing changefreq`);
        return;
      }

      if (!validFreqs.includes(url.changefreq)) {
        this.error(`URL ${index + 1}: Invalid changefreq value`, url.changefreq);
      } else {
        this.pass(`Valid changefreq (${url.changefreq}): ${this.truncateURL(url.loc)}`);
      }
    });

    console.log('');
  }

  checkLastModDates(xml) {
    console.log(`${colors.blue}📅 Checking lastmod dates...${colors.reset}`);

    const datePattern = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(?:[+-]\d{2}:\d{2}|Z)?)?$/;

    xml.urls.forEach((url, index) => {
      if (url.lastmod === null) {
        this.warning(`URL ${index + 1}: Missing lastmod date`);
        return;
      }

      if (!datePattern.test(url.lastmod)) {
        this.error(`URL ${index + 1}: Invalid date format`, url.lastmod);
      } else {
        // Check if date is not in the future
        const date = new Date(url.lastmod);
        const now = new Date();
        if (date > now) {
          this.warning(`URL ${index + 1}: Future date detected`, url.lastmod);
        } else {
          this.pass(`Valid lastmod: ${this.truncateURL(url.loc)}`);
        }
      }
    });

    console.log('');
  }

  checkDuplicates(xml) {
    console.log(`${colors.blue}🔍 Checking for duplicates...${colors.reset}`);

    const urls = xml.urls.map(u => u.loc);
    const seen = new Set();
    const duplicates = new Set();

    urls.forEach(url => {
      if (seen.has(url)) {
        duplicates.add(url);
      }
      seen.add(url);
    });

    if (duplicates.size > 0) {
      this.error('Duplicate URLs found', Array.from(duplicates).join(', '));
    } else {
      this.pass('No duplicate URLs found');
    }

    console.log('');
  }

  checkFileExistence(xml) {
    console.log(`${colors.blue}📁 Checking file existence...${colors.reset}`);

    const basePath = path.dirname(this.sitemapPath);
    let checked = 0;

    xml.urls.forEach((url, index) => {
      // Extract filename from URL
      const urlPath = new URL(url.loc).pathname;
      let filename = urlPath === '/' ? '/index.html' : urlPath;

      // Check if file exists (for local validation)
      const fullPath = path.join(basePath, filename);

      if (fs.existsSync(fullPath)) {
        checked++;
      } else {
        this.warning(`URL ${index + 1}: File not found locally`, filename);
      }
    });

    if (checked === xml.urls.length) {
      this.pass(`All ${checked} files exist locally`);
    } else {
      this.pass(`${checked}/${xml.urls.length} files exist locally`);
    }

    console.log('');
  }

  truncateURL(url) {
    return url.length > 50 ? url.substring(0, 47) + '...' : url;
  }

  pass(message) {
    this.passed++;
    console.log(`  ${colors.green}✓${colors.reset} ${message}`);
  }

  error(message, detail = '') {
    this.failed++;
    this.errors.push({ message, detail });
    console.log(`  ${colors.red}✗${colors.reset} ${message}${detail ? `: ${detail}` : ''}`);
  }

  warning(message, detail = '') {
    this.warnings.push({ message, detail });
    console.log(`  ${colors.yellow}⚠${colors.reset} ${message}${detail ? `: ${detail}` : ''}`);
  }

  printResults() {
    console.log(`${colors.blue}═══════════════════════════════════════════════════════════${colors.reset}`);
    console.log(`${colors.blue}  VALIDATION RESULTS${colors.reset}`);
    console.log(`${colors.blue}═══════════════════════════════════════════════════════════${colors.reset}\n`);

    console.log(`${colors.green}Passed: ${this.passed}${colors.reset}`);
    console.log(`${colors.red}Failed: ${this.failed}${colors.reset}`);
    console.log(`${colors.yellow}Warnings: ${this.warnings.length}${colors.reset}`);

    if (this.failed === 0) {
      console.log(`\n${colors.green}✓ SITEMAP IS VALID${colors.reset}`);
    } else {
      console.log(`\n${colors.red}✗ SITEMAP HAS ERRORS${colors.reset}`);
      console.log(`\n${colors.red}Errors:${colors.reset}`);
      this.errors.forEach((err, i) => {
        console.log(`  ${i + 1}. ${err.message}${err.detail ? `: ${err.detail}` : ''}`);
      });
    }

    if (this.warnings.length > 0) {
      console.log(`\n${colors.yellow}Warnings:${colors.reset}`);
      this.warnings.forEach((warn, i) => {
        console.log(`  ${i + 1}. ${warn.message}${warn.detail ? `: ${warn.detail}` : ''}`);
      });
    }

    console.log(`\n${colors.blue}═══════════════════════════════════════════════════════════${colors.reset}\n`);
  }
}

// Run validation
const sitemapPath = process.argv[2] || './sitemap.xml';
const validator = new SitemapValidator(sitemapPath);
const isValid = validator.validate();

process.exit(isValid ? 0 : 1);