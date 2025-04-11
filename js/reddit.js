// Reddit API configuration
const REDDIT_API_URL = 'https://www.reddit.com/r/CFB/new.json?limit=100&t=day';

// College logos will be loaded dynamically
let COLLEGE_LOGOS = {};

// Function to load college logos
async function loadCollegeLogos() {
    try {
        const response = await fetch('js/college-logos.json');
        COLLEGE_LOGOS = await response.json();
        console.log('Loaded college logos:', COLLEGE_LOGOS);
    } catch (error) {
        console.error('Error loading college logos:', error);
    }
}

// Function to detect college name in title
function detectCollege(title) {
    console.log('Checking title for colleges:', title);
    // Sort colleges by length (longest first) to match longer names before shorter ones
    const sortedColleges = Object.keys(COLLEGE_LOGOS).sort((a, b) => b.length - a.length);
    
    for (const college of sortedColleges) {
        // Create a regex pattern that matches the college name as a whole word
        // Escape special characters in the college name
        const escapedCollege = college.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const pattern = new RegExp(`\\b${escapedCollege}\\b`, 'i');
        if (pattern.test(title)) {
            console.log('Found college:', college);
            console.log('Logo URL:', COLLEGE_LOGOS[college]);
            return college;
        }
    }
    console.log('No college found in title');
    return null;
}

// Function to format the post title
function formatTitle(title) {
    return title.length > 100 ? title.substring(0, 100) + '...' : title;
}

// Function to get post thumbnail
function getThumbnail(post) {
    // Check for preview images first (highest quality)
    if (post.preview && post.preview.images && post.preview.images[0]) {
        return post.preview.images[0].source.url.replace(/&amp;/g, '&');
    }
    // Check for post_hint and url
    if (post.post_hint === 'image' && post.url) {
        return post.url;
    }
    // Check for thumbnail
    if (post.thumbnail && post.thumbnail !== 'self' && post.thumbnail !== 'default') {
        return post.thumbnail;
    }
    // Use r/CFB subreddit icon as fallback
    return 'https://styles.redditmedia.com/t5_2qizd/styles/communityIcon_1bqa1ibfp8q51.png';
}

// Function to create news card HTML
function createNewsCard(post) {
    const college = detectCollege(post.data.title);
    console.log('Creating card for college:', college);
    const logoHtml = college ? `<div class="college-logo"><img src="${COLLEGE_LOGOS[college]}" alt="${college} logo"></div>` : '';
    
    return `
        <article class="news-card">
            <img src="${getThumbnail(post.data)}" alt="${post.data.title}">
            <div class="news-content">
                <h3><a href="https://reddit.com${post.data.permalink}" target="_blank">${formatTitle(post.data.title)}</a></h3>
                <p>Posted by u/${post.data.author} • ${new Date(post.data.created_utc * 1000).toLocaleDateString()}</p>
            </div>
            ${logoHtml}
        </article>
    `;
}

// Function to fetch and display Reddit posts
async function fetchRedditNews() {
    try {
        const response = await fetch(REDDIT_API_URL);
        const data = await response.json();
        
        const newsContainer = document.getElementById('reddit-news');
        if (newsContainer) {
            newsContainer.innerHTML = data.data.children
                .map(post => createNewsCard(post))
                .join('');
        }
    } catch (error) {
        console.error('Error fetching Reddit news:', error);
    }
}

// Initialize the page
async function initialize() {
    await loadCollegeLogos();
    await fetchRedditNews();
}

// Call the initialization function when the page loads
document.addEventListener('DOMContentLoaded', initialize); 