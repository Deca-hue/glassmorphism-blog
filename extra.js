 // Local storage keys
        const POSTS_KEY = 'glassblog_posts';
        const SAVED_KEY = 'glassblog_saved';
        
        // DOM Elements
        const loadingScreen = document.getElementById('loadingScreen');
        const articlesContainer = document.getElementById('articles-container');
        const savedContainer = document.getElementById('saved-container');
        const searchContainer = document.getElementById('search-container');
        const savedSection = document.getElementById('saved-section');
        const searchSection = document.getElementById('search-section');
        const mainContent = document.getElementById('main-content');
        
        // Initialize the app
        document.addEventListener('DOMContentLoaded', function() {
            // Show loading screen
            showLoading();
            
            // Load initial data
            setTimeout(() => {
                initPosts();
                updateSavedCount();
                initEventListeners();
                hideLoading();
            }, 1500);
        });
        
        // Loading functions
        function showLoading() {
            loadingScreen.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
        
        function hideLoading() {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
                document.body.style.overflow = 'auto';
            }, 500);
        }
        
        // Post functions
        function initPosts() {
            // Check if posts exist in localStorage
            let posts = JSON.parse(localStorage.getItem(POSTS_KEY));
            
            // If no posts, create sample posts
            if (!posts || posts.length === 0) {
                posts = [
                    {
                        id: '1',
                        title: 'Getting Started with Glassmorphism',
                        category: 'design',
                        image: 'https://source.unsplash.com/random/600x400/?ui,design',
                        content: 'Glassmorphism is a modern UI design trend that creates a frosted glass effect...',
                        author: 'Jane Doe',
                        date: '2023-05-20',
                        likes: 42
                    },
                    // Add more sample posts...
                ];
                localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
            }
            
            // Render posts
            renderPosts(posts, articlesContainer);
        }
        
        function renderPosts(posts, container) {
            const savedPosts = JSON.parse(localStorage.getItem(SAVED_KEY)) || [];
            
            container.innerHTML = posts.map(post => `
                <article class="glass-card rounded-xl overflow-hidden hover:shadow-lg transition relative">
                    ${savedPosts.includes(post.id) ? 
                        '<span class="saved-indicator"><i class="fas fa-bookmark mr-1 text-blue-400"></i> Saved</span>' : ''}
                    <a href="post.html?id=${post.id}" class="block">
                        <img src="${post.image}" alt="${post.title}" class="w-full h-48 object-cover">
                        <div class="p-6">
                            <span class="inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 
                                  ${getCategoryColor(post.category)}">${post.category}</span>
                            <h3 class="text-xl font-bold text-white mb-3">${post.title}</h3>
                            <p class="text-blue-100 text-sm mb-4">${post.content.substring(0, 100)}...</p>
                            <div class="flex items-center justify-between">
                                <div class="flex items-center">
                                    <img src="https://source.unsplash.com/random/40x40/?portrait" alt="${post.author}" 
                                         class="w-8 h-8 rounded-full mr-2">
                                    <span class="text-white text-sm">${post.author}</span>
                                </div>
                                <span class="text-blue-200 text-xs">${new Date(post.date).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </a>
                    <button class="save-btn absolute top-4 right-4 p-2 rounded-full bg-white bg-opacity-20 text-white hover:bg-opacity-30 transition"
                            data-post-id="${post.id}">
                        <i class="${savedPosts.includes(post.id) ? 'fas' : 'far'} fa-bookmark"></i>
                    </button>
                </article>
            `).join('');
        }
        
        // Saved articles functionality
        function updateSavedCount() {
            const savedPosts = JSON.parse(localStorage.getItem(SAVED_KEY)) || [];
            document.getElementById('saved-count').textContent = savedPosts.length;
            document.getElementById('mobile-saved-count').textContent = savedPosts.length;
        }
        
        function showSavedArticles() {
            const savedPosts = JSON.parse(localStorage.getItem(SAVED_KEY)) || [];
            const allPosts = JSON.parse(localStorage.getItem(POSTS_KEY)) || [];
            
            const savedPostsData = allPosts.filter(post => savedPosts.includes(post.id));
            
            if (savedPostsData.length > 0) {
                renderPosts(savedPostsData, savedContainer);
                savedSection.classList.remove('hidden');
                mainContent.classList.add('hidden');
            } else {
                savedContainer.innerHTML = '<p class="text-blue-200 col-span-3 text-center py-8">No saved articles yet</p>';
                savedSection.classList.remove('hidden');
                mainContent.classList.add('hidden');
            }
        }
        
        // Search functionality
        function searchPosts(query) {
            const posts = JSON.parse(localStorage.getItem(POSTS_KEY)) || [];
            const results = posts.filter(post => 
                post.title.toLowerCase().includes(query.toLowerCase()) || 
                post.content.toLowerCase().includes(query.toLowerCase()) ||
                post.author.toLowerCase().includes(query.toLowerCase())
            );
            
            if (results.length > 0) {
                renderPosts(results, searchContainer);
                searchSection.classList.remove('hidden');
                mainContent.classList.add('hidden');
            } else {
                searchContainer.innerHTML = '<p class="text-blue-200 col-span-3 text-center py-8">No articles found</p>';
                searchSection.classList.remove('hidden');
                mainContent.classList.add('hidden');
            }
        }
        
        // Event listeners
        function initEventListeners() {
            // Save button
            document.addEventListener('click', function(e) {
                if (e.target.closest('.save-btn')) {
                    const btn = e.target.closest('.save-btn');
                    const postId = btn.dataset.postId;
                    let savedPosts = JSON.parse(localStorage.getItem(SAVED_KEY)) || [];
                    
                    if (savedPosts.includes(postId)) {
                        savedPosts = savedPosts.filter(id => id !== postId);
                        btn.innerHTML = '<i class="far fa-bookmark"></i>';
                    } else {
                        savedPosts.push(postId);
                        btn.innerHTML = '<i class="fas fa-bookmark"></i>';
                    }
                    
                    localStorage.setItem(SAVED_KEY, JSON.stringify(savedPosts));
                    updateSavedCount();
                }
                
                // Close buttons
                if (e.target.closest('#close-saved') || e.target.closest('#close-search')) {
                    savedSection.classList.add('hidden');
                    searchSection.classList.add('hidden');
                    mainContent.classList.remove('hidden');
                }
            });
            
            // Saved link
            document.getElementById('saved-link').addEventListener('click', function(e) {
                e.preventDefault();
                showSavedArticles();
            });
            
            document.getElementById('mobile-saved-link').addEventListener('click', function(e) {
                e.preventDefault();
                document.getElementById('mobile-menu').classList.add('hidden');
                showSavedArticles();
            });
            
            // Search input
            document.getElementById('search-input').addEventListener('input', function(e) {
                if (e.target.value.length >= 2) {
                    searchPosts(e.target.value);
                }
            });
            
            document.getElementById('mobile-search-input').addEventListener('input', function(e) {
                if (e.target.value.length >= 2) {
                    document.getElementById('mobile-menu').classList.add('hidden');
                    searchPosts(e.target.value);
                }
            });
        }
        
        // Helper functions
        function getCategoryColor(category) {
            const colors = {
                design: 'bg-pink-500 bg-opacity-20 text-pink-300',
                development: 'bg-blue-500 bg-opacity-20 text-blue-300',
                javascript: 'bg-yellow-500 bg-opacity-20 text-yellow-300',
                tutorial: 'bg-purple-500 bg-opacity-20 text-purple-300'
            };
            return colors[category] || 'bg-gray-500 bg-opacity-20 text-gray-300';
        }