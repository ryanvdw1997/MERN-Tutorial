This codebase has a timed scraper using CRON for automated job schedule and Puppeteer.js for the web scraping.
It scrapes the energy prices off of the ERCOT website graph, switching between the various energy hubs using Puppeteer.
It then assembles those data points into MongoDB documents that get put into their assigned MongoDB collections.
