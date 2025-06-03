// Local storage key for posts
        const POSTS_KEY = 'glassblog_posts';
        const LIKED_POSTS_KEY = 'glassblog_liked_posts';

        // Initialize the app
        document.addEventListener('DOMContentLoaded', function() {
            // Common functionality
            initCommon();
            
            // Page-specific functionality
            initHomePage();
        });

        // Common functionality across all pages
        function initCommon() {
            // Mobile menu toggle
            const menuToggle = document.getElementById('menu-toggle');
            const mobileMenu = document.getElementById('mobile-menu');
            
            if (menuToggle && mobileMenu) {
                menuToggle.addEventListener('click', function() {
                    mobileMenu.classList.toggle('hidden');
                });
            }
        }

        // Home page functionality
        function initHomePage() {
            // Load and display posts
            loadPosts();
        }

        // Load all posts for home page
        function loadPosts() {
            const postsContainer = document.getElementById('articles-container');
            if (!postsContainer) return;
            
            // Get posts from local storage
            const posts = getPosts();
            
            if (posts.length === 0) {
                // Create some sample posts if none exist
                createSamplePosts();
                loadPosts(); // Recursively call to load the sample posts
                return;
            }
            
            // Clear container
            postsContainer.innerHTML = '';
            
            // Add each post to the container
            posts.forEach(post => {
                const isLiked = checkIfLiked(post.id);
                
                const postElement = document.createElement('article');
                postElement.className = 'glass-card rounded-xl overflow-hidden transition-transform hover:scale-105';
                postElement.innerHTML = `
                    <a href="post.html?id=${post.id}">
                        <img src="${post.image}" alt="${post.title}" class="w-full h-48 object-cover">
                    </a>
                    <div class="p-6">
                        <span class="inline-block px-2 py-1 ${getCategoryColor(post.category)} rounded-full text-xs mb-3">${formatCategory(post.category)}</span>
                        <a href="post.html?id=${post.id}">
                            <h3 class="text-xl font-bold text-white mb-3">${post.title}</h3>
                        </a>
                        <p class="text-blue-100 text-sm mb-4">${post.content.substring(0, 100)}...</p>
                        <div class="flex items-center justify-between">
                            <div class="flex items-center">
                                <img src="${post.author.avatar}" alt="${post.author.name}" class="w-8 h-8 rounded-full mr-2">
                                <span class="text-white text-xs">${post.author.name}</span>
                            </div>
                            <div class="flex items-center">
                                <span class="text-blue-200 text-xs mr-3">${formatDate(post.date)}</span>
                                <button class="like-btn text-white ${isLiked ? 'liked' : ''}" data-post-id="${post.id}">
                                    <i class="fas fa-heart mr-1"></i> ${post.likes}
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                
                postsContainer.appendChild(postElement);
            });
            
            // Add event listeners to like buttons
            document.querySelectorAll('.like-btn').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleLike(this.getAttribute('data-post-id'));
                });
            });
        }
// Search functionality
document.getElementById('search-input').addEventListener('input', function(e) {
  const query = e.target.value.toLowerCase();
  const resultsContainer = document.getElementById('results-container');
  const searchSection = document.getElementById('search-results');
  
  if (query.length < 2) {
    searchSection.classList.add('hidden');
    return;
  }
  
  const articles = JSON.parse(localStorage.getItem('articles')) || [];
  const results = articles.filter(article => 
    article.title.toLowerCase().includes(query) || 
    article.content.toLowerCase().includes(query)
  );
  
  resultsContainer.innerHTML = '';
  
  if (results.length === 0) {
    resultsContainer.innerHTML = '<p class="text-blue-200">No articles found</p>';
  } else {
    results.forEach(article => {
      resultsContainer.appendChild(createArticleCard(article));
    });
  }
  
  searchSection.classList.remove('hidden');
});

// Helper function to create article cards
function createArticleCard(article) {
  const card = document.createElement('article');
  card.className = 'glass-card rounded-xl overflow-hidden';
  card.innerHTML = `
    <!-- Same card structure as index.html -->
  `;
  return card;
}
        // Post storage functions
        function getPosts() {
            const postsJson = localStorage.getItem(POSTS_KEY);
            return postsJson ? JSON.parse(postsJson) : [];
        }

        function savePost(post) {
            const posts = getPosts();
            posts.unshift(post); // Add new post at the beginning
            localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
        }

        function updatePost(postId, updates) {
            const posts = getPosts();
            const postIndex = posts.findIndex(p => p.id === postId);
            
            if (postIndex !== -1) {
                posts[postIndex] = { ...posts[postIndex], ...updates };
                localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
                return true;
            }
            
            return false;
        }

        // Like functionality
        function checkIfLiked(postId) {
            const likedPosts = JSON.parse(localStorage.getItem(LIKED_POSTS_KEY)) || [];
            return likedPosts.includes(postId);
        }

        function toggleLike(postId) {
            let likedPosts = JSON.parse(localStorage.getItem(LIKED_POSTS_KEY)) || [];
            const isLiked = likedPosts.includes(postId);
            
            if (isLiked) {
                likedPosts = likedPosts.filter(id => id !== postId);
                updatePost(postId, { likes: Math.max(0, getPostLikes(postId) - 1) });
            } else {
                likedPosts.push(postId);
                updatePost(postId, { likes: getPostLikes(postId) + 1 });
            }
            
            localStorage.setItem(LIKED_POSTS_KEY, JSON.stringify(likedPosts));
            
            // Refresh the view
            loadPosts();
        }

        function getPostLikes(postId) {
            const posts = getPosts();
            const post = posts.find(p => p.id === postId);
            return post ? post.likes : 0;
        }

        // Helper functions
        function formatDate(dateString) {
            const options = { year: 'numeric', month: 'short', day: 'numeric' };
            return new Date(dateString).toLocaleDateString(undefined, options);
        }

        function formatCategory(category) {
            return category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ');
        }

        function getCategoryColor(category) {
            const colors = {
                design: 'bg-pink-500 bg-opacity-20 text-pink-100',
                development: 'bg-blue-500 bg-opacity-20 text-blue-100',
                javascript: 'bg-yellow-500 bg-opacity-20 text-yellow-100',
                'ui-ux': 'bg-purple-500 bg-opacity-20 text-purple-100'
            };
            return colors[category] || 'bg-gray-500 bg-opacity-20 text-gray-100';
        }

        // Create sample posts if none exist
        function createSamplePosts() {
            const samplePosts = [
                {
                    id: '1',
                    title: 'The Future of UI Design: Glassmorphism',
                    category: 'design',
                    image: 'https://source.unsplash.com/random/600x400/?tech,design',
                    content: 'Glassmorphism is a modern UI design trend that creates a frosted glass effect. This design approach uses transparency and blur effects to create depth in the interface while maintaining readability. In this article, we explore how to implement glassmorphism in your designs and when to use it effectively.\n\nGlassmorphism works particularly well for cards, modals, and other floating elements. The key is to balance transparency with proper contrast to ensure text remains readable. When done correctly, glassmorphism can create a sophisticated, modern look that users find visually appealing.',
                    author: {
                        name: 'Sarah Johnson',
                        avatar: 'https://source.unsplash.com/random/50x50/?woman'
                    },
                    date: '2023-05-15T10:30:00Z',
                    likes: 42,
                    liked: false
                },
                {
                    id: '2',
                    title: 'Mastering CSS Filters',
                    category: 'development',
                    image: 'https://source.unsplash.com/random/600x400/?code',
                    content: 'CSS filters provide powerful ways to manipulate the rendering of elements on your webpage. From blur effects to color adjustments, filters can help you create visually stunning interfaces without JavaScript.\n\nIn this tutorial, we cover all the available CSS filter functions: blur(), brightness(), contrast(), drop-shadow(), grayscale(), hue-rotate(), invert(), opacity(), saturate(), and sepia(). You\'ll learn how to combine multiple filters and animate them for smooth transitions.',
                    author: {
                        name: 'Mike Chen',
                        avatar: 'https://source.unsplash.com/random/50x50/?man'
                    },
                    date: '2023-05-10T14:15:00Z',
                    likes: 28,
                    liked: false
                },
                {
                    id: '3',
                    title: 'Modern ES6 Features You Should Be Using',
                    category: 'javascript',
                    image: 'https://source.unsplash.com/random/600x400/?javascript',
                    content: 'ECMAScript 6 (ES6) introduced many features that have become essential for modern JavaScript development. Even if you\'re familiar with ES6, you might not be using all of its powerful capabilities.\n\nThis article dives into some of the most useful ES6 features including arrow functions, template literals, destructuring, default parameters, rest and spread operators, and modules. For each feature, we provide clear examples of how and when to use them in your projects.',
                    author: {
                        name: 'Alex Rivera',
                        avatar: 'https://source.unsplash.com/random/50x50/?developer'
                    },
                    date: '2023-04-28T09:45:00Z',
                    likes: 35,
                    liked: false
                }
            ];
            
            localStorage.setItem(POSTS_KEY, JSON.stringify(samplePosts));
        }