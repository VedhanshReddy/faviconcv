// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Initialize theme
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.dataset.theme = savedTheme;
    } else {
        document.body.dataset.theme = prefersDarkScheme.matches ? 'dark' : 'light';
    }
}

// Toggle theme
function toggleTheme() {
    const currentTheme = document.body.dataset.theme;
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.body.dataset.theme = newTheme;
    localStorage.setItem('theme', newTheme);
}

// Event listeners for theme
themeToggle.addEventListener('click', toggleTheme);
prefersDarkScheme.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        document.body.dataset.theme = e.matches ? 'dark' : 'light';
    }
});

// Initialize theme on load
initializeTheme();

// DOM Elements
const textInput = document.getElementById('text-input');
const emojiPickerBtn = document.getElementById('emoji-picker-btn');
const emojiIcon = emojiPickerBtn.querySelector('.emoji-icon');
const imageInput = document.getElementById('image-input');
const bgColorInput = document.getElementById('background-color');
const textColorInput = document.getElementById('text-color');
const preview16 = document.getElementById('preview-16');
const preview32 = document.getElementById('preview-32');
const preview48 = document.getElementById('preview-48');
const downloadIcoBtn = document.getElementById('download-ico');
const downloadPngBtn = document.getElementById('download-png');
const copyButton = document.getElementById('copy-button');
const htmlTag = document.getElementById('html-tag');
const emojiModal = document.querySelector('.emoji-modal');
const emojiModalOverlay = document.querySelector('.emoji-modal-overlay');
const closeModalBtn = document.querySelector('.close-modal');

// Canvas contexts
const ctx16 = preview16.getContext('2d');
const ctx32 = preview32.getContext('2d');
const ctx48 = preview48.getContext('2d');

// State
let currentImage = null;
let currentEmoji = null;

// Updated emoji list with comprehensive Apple-style emojis
const emojis = [
    // Smileys & Emotions
    '😀', '😃', '😄', '😁', '😅', '😂', '🤣', '🥲',
    '☺️', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍',
    '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝',
    '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🥸', '🤩',
    '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁',
    '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭',

    // Face & People
    '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑',
    '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱',
    '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮',
    '👶', '👧', '🧒', '👦', '👩', '🧑', '👨', '👴',
    '👵', '🧓', '👨‍👩‍👦', '👨‍👩‍👧', '👨‍👩‍👧‍👦', '👩‍👦', '👩‍👧', '👨‍👦',

    // Hands & Gestures
    '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏',
    '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆',
    '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛',
    '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️',

    // Animals
    '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼',
    '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔',
    '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄',
    '🐝', '🪱', '🐛', '🦋', '🐌', '🐞', '🐜', '🪰',

    // Nature & Plants
    '🌸', '💮', '🏵️', '🌹', '🥀', '🌺', '🌻', '🌼',
    '🌷', '🌱', '🪴', '🌲', '🌳', '🌴', '🌵', '🌾',
    '🌿', '☘️', '🍀', '🍁', '🍂', '🍃', '🌍', '🌎',
    '🌏', '🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗',

    // Food & Drink
    '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓',
    '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝',
    '🍅', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑', '🥕',
    '☕', '🫖', '🍵', '🧃', '🥤', '🧋', '🍶', '🍾',

    // Activities & Sports
    '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉',
    '🎱', '🎳', '🏏', '🏑', '🏒', '🥍', '🏓', '🏸',
    '🎮', '🕹️', '🎲', '🎭', '🎨', '🎼', '🎧', '🎤',
    '🎪', '🎫', '🎟️', '🎯', '🎱', '🎳', '🎮', '🎲',

    // Travel & Places
    '🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑',
    '🚒', '🚐', '🛻', '🚚', '🚛', '🚜', '🛵', '🏍️',
    '🚲', '🛴', '🚨', '🚔', '🚍', '🚘', '🚖', '🛺',
    '✈️', '🛫', '🛬', '🛩️', '💺', '🚀', '🛸', '🚁',

    // Objects & Tools
    '⌚', '📱', '📲', '💻', '⌨️', '🖥️', '🖨️', '🖱️',
    '🖲️', '🕹️', '🗜️', '💽', '💾', '💿', '📀', '📼',
    '📷', '📸', '📹', '🎥', '📽️', '🎞️', '📞', '☎️',
    '📟', '📠', '📺', '📻', '🎙️', '🎚️', '🎛️', '🧭',

    // Symbols & Hearts
    '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍',
    '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖',
    '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️',
    '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈',

    // Additional Symbols
    '✨', '⭐', '🌟', '💫', '⚡', '☀️', '🌈', '🌪️',
    '🌤️', '⛅', '🌥️', '☁️', '🌦️', '🌧️', '⛈️', '🌩️',
    '🎯', '🎪', '🎨', '🔮', '🎲', '🎭', '🎪', '🎨',
    '💎', '🔋', '🔌', '💡', '🔦', '🕯️', '🪔', '🧯'
];

// Add new DOM elements
const clearTextBtn = document.getElementById('clear-text');
const clearEmojiBtn = document.getElementById('clear-emoji');
const clearImageBtn = document.getElementById('clear-image');
const emojiCategories = document.getElementById('emoji-categories');

// Categories configuration
const categories = [
    { id: 'smileys', name: ' Smileys & Emotions', icon: '😊', start: 0, end: 47 },
    { id: 'people', name: ' Face & People', icon: '👥', start: 48, end: 95 },
    { id: 'hands', name: ' Hands & Gestures', icon: '👋', start: 96, end: 127 },
    { id: 'animals', name: ' Animals', icon: '🐶', start: 128, end: 159 },
    { id: 'nature', name: ' Nature & Plants', icon: '🌸', start: 160, end: 191 },
    { id: 'food', name: ' Food & Drink', icon: '🍎', start: 192, end: 223 },
    { id: 'activities', name: ' Activities & Sports', icon: '⚽', start: 224, end: 255 },
    { id: 'travel', name: ' Travel & Places', icon: '✈️', start: 256, end: 287 },
    { id: 'objects', name: ' Objects & Tools', icon: '💻', start: 288, end: 319 },
    { id: 'symbols', name: ' Symbols & Hearts', icon: '❤️', start: 320, end: 351 },
    { id: 'additional', name: ' Additional Symbols', icon: '✨', start: 352, end: 383 }
];

// Event listeners
textInput.addEventListener('input', updateFavicon);
imageInput.addEventListener('change', handleImageUpload);
bgColorInput.addEventListener('input', updateFavicon);
textColorInput.addEventListener('input', updateFavicon);
downloadIcoBtn.addEventListener('click', downloadIco);
downloadPngBtn.addEventListener('click', downloadPng);
copyButton.addEventListener('click', copyHtmlTag);

// Event Listeners for Modal
emojiPickerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    emojiModal.classList.remove('hidden');
});

closeModalBtn.addEventListener('click', () => {
    emojiModal.classList.add('hidden');
});

emojiModalOverlay.addEventListener('click', () => {
    emojiModal.classList.add('hidden');
});

// File input handling - Move this before the clear button event listeners
const fileButton = document.querySelector('.file-button');
const fileName = fileButton.querySelector('.file-name');

// Clear button event listeners
clearTextBtn.addEventListener('click', () => {
    // Clear text
    textInput.value = '';
    // Clear emoji
    currentEmoji = null;
    emojiIcon.textContent = 'Select an emoji';
    emojiIcon.classList.remove('has-emoji');
    // Clear image
    currentImage = null;
    imageInput.value = '';
    if (fileName) {
        fileName.textContent = '';
    }
    if (fileButton) {
        fileButton.style.borderColor = 'var(--border-color)';
    }
    updateFavicon();
});

clearEmojiBtn.addEventListener('click', () => {
    // Clear emoji
    currentEmoji = null;
    emojiIcon.textContent = 'Select an emoji';
    emojiIcon.classList.remove('has-emoji');
    // Clear text
    textInput.value = '';
    // Clear image
    currentImage = null;
    imageInput.value = '';
    if (fileName) {
        fileName.textContent = '';
    }
    if (fileButton) {
        fileButton.style.borderColor = 'var(--border-color)';
    }
    updateFavicon();
});

clearImageBtn.addEventListener('click', () => {
    // Clear image
    currentImage = null;
    imageInput.value = '';
    if (fileName) {
        fileName.textContent = '';
    }
    if (fileButton) {
        fileButton.style.borderColor = 'var(--border-color)';
    }
    // Clear text
    textInput.value = '';
    // Clear emoji
    currentEmoji = null;
    emojiIcon.textContent = 'Select an emoji';
    emojiIcon.classList.remove('has-emoji');
    updateFavicon();
});

// Image input change handler
imageInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        const file = e.target.files[0];
        if (fileName) {
            fileName.textContent = file.name;
        }
        if (fileButton) {
            fileButton.style.borderColor = 'var(--primary-color)';
        }
        handleImageUpload(e);
    } else {
        if (fileName) {
            fileName.textContent = '';
        }
        if (fileButton) {
            fileButton.style.borderColor = 'var(--border-color)';
        }
    }
});

// Update favicon preview
function updateFavicon() {
    const sizes = [
        { canvas: preview16, ctx: ctx16, size: 16 },
        { canvas: preview32, ctx: ctx32, size: 32 },
        { canvas: preview48, ctx: ctx48, size: 48 }
    ];

    // Use requestAnimationFrame for smoother rendering
    requestAnimationFrame(() => {
        sizes.forEach(({ canvas, ctx, size }) => {
            // Clear canvas
            ctx.fillStyle = bgColorInput.value;
            ctx.fillRect(0, 0, size, size);

            if (currentImage) {
                drawImageCentered(ctx, currentImage, size);
            } else if (currentEmoji) {
                drawTextCentered(ctx, currentEmoji, size, currentFont);
            } else if (textInput.value) {
                drawTextCentered(ctx, textInput.value, size, currentFont);
            }
        });
    });
}

// Helper function to draw centered text
function drawTextCentered(ctx, text, size, font) {
    ctx.fillStyle = textColorInput.value;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Calculate font size (approximately 75% of canvas height)
    const fontSize = Math.floor(size * 0.75);
    ctx.font = `${fontSize}px ${font}`;
    
    // Draw text in center
    ctx.fillText(text, size / 2, size / 2);
}

// Helper function to draw centered image
function drawImageCentered(ctx, img, size) {
    const scale = Math.min(size / img.width, size / img.height);
    const x = (size - img.width * scale) / 2;
    const y = (size - img.height * scale) / 2;
    ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
}

// Download functions
async function downloadIco() {
    try {
        // Create a temporary canvas for the ICO format
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = 32;
        tempCanvas.height = 32;
        const tempCtx = tempCanvas.getContext('2d');
        
        // Copy the 32x32 preview
        tempCtx.drawImage(preview32, 0, 0);
        
        // Convert to blob
        const blob = await new Promise(resolve => tempCanvas.toBlob(resolve));
        
        // Trigger download
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'favicon.ico';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Error generating ICO:', error);
        alert('Error generating ICO file. Please try again.');
    }
}

function downloadPng() {
    try {
        // Use the 48x48 version for PNG
        const url = preview48.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = url;
        a.download = 'favicon.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } catch (error) {
        console.error('Error generating PNG:', error);
        alert('Error generating PNG file. Please try again.');
    }
}

// Copy HTML tag
function copyHtmlTag() {
    const tag = htmlTag.textContent;
    navigator.clipboard.writeText(tag)
        .then(() => {
            const originalText = copyButton.textContent;
            copyButton.textContent = 'Copied!';
            setTimeout(() => {
                copyButton.textContent = originalText;
            }, 2000);
        })
        .catch(err => {
            console.error('Failed to copy:', err);
            alert('Failed to copy to clipboard');
        });
}

// Handle image upload
function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            currentImage = img;
            currentEmoji = null;
            emojiIcon.textContent = 'Select an emoji';
            emojiIcon.classList.remove('has-emoji');
            updateFavicon();
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);

    // Clear text input
    textInput.value = '';
}

// Add scroll button elements
const scrollLeftBtn = document.getElementById('scroll-left');
const scrollRightBtn = document.getElementById('scroll-right');
const categoriesContainer = document.getElementById('emoji-categories');

// Scroll button event listeners
scrollLeftBtn.addEventListener('click', () => {
    categoriesContainer.scrollBy({
        left: -200,
        behavior: 'smooth'
    });
});

scrollRightBtn.addEventListener('click', () => {
    categoriesContainer.scrollBy({
        left: 200,
        behavior: 'smooth'
    });
});

// Update scroll button visibility
function updateScrollButtons() {
    const { scrollLeft, scrollWidth, clientWidth } = categoriesContainer;
    
    // Both buttons are hidden by default (via CSS)
    // Only show buttons if there's actually scrollable content
    if (scrollWidth > clientWidth) {
        // Show right button if we're not at the end
        if (scrollLeft + clientWidth < scrollWidth) {
            scrollRightBtn.classList.remove('hidden');
        } else {
            scrollRightBtn.classList.add('hidden');
        }
        
        // Show left button if we've scrolled away from the start
        if (scrollLeft > 0) {
            scrollLeftBtn.classList.remove('hidden');
        } else {
            scrollLeftBtn.classList.add('hidden');
        }
    } else {
        // No scrollable content, keep both buttons hidden
        scrollLeftBtn.classList.add('hidden');
        scrollRightBtn.classList.add('hidden');
    }
}

// Add scroll event listener to categories container
categoriesContainer.addEventListener('scroll', updateScrollButtons);

// Update scroll buttons on window resize
window.addEventListener('resize', updateScrollButtons);

// Initialize emoji picker with categories
function initEmojiPicker() {
    // Create category buttons
    categories.forEach(category => {
        const categoryBtn = document.createElement('button');
        categoryBtn.className = 'category-btn';
        categoryBtn.dataset.categoryId = category.id;
        
        // Create icon and name spans
        const iconSpan = document.createElement('span');
        iconSpan.className = 'category-icon';
        iconSpan.textContent = category.icon;
        
        categoryBtn.appendChild(iconSpan);
        categoryBtn.appendChild(document.createTextNode(category.name));
        categoriesContainer.appendChild(categoryBtn);

        categoryBtn.addEventListener('click', () => {
            // Remove active class from all buttons
            document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            categoryBtn.classList.add('active');
            
            // Add emojis for this category
            updateEmojiGrid(category);

            // Center the active category button
            const containerWidth = categoriesContainer.offsetWidth;
            const buttonLeft = categoryBtn.offsetLeft;
            const buttonWidth = categoryBtn.offsetWidth;
            const scrollPosition = buttonLeft - (containerWidth / 2) + (buttonWidth / 2);
            
            categoriesContainer.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });

            // Update scroll buttons after category change
            updateScrollButtons();
        });
    });

    // Set first category as active and show its emojis
    const firstCategory = categories[0];
    const firstCategoryBtn = document.querySelector('.category-btn');
    firstCategoryBtn.classList.add('active');
    updateEmojiGrid(firstCategory);

    // Initialize scroll buttons
    updateScrollButtons();
}

// Function to update emoji grid for a category
function updateEmojiGrid(category) {
    const emojiGrid = document.getElementById('emoji-picker');
    emojiGrid.innerHTML = ''; // Clear existing content

    // Add emojis for this category
    const categoryEmojis = emojis.slice(category.start, category.end + 1);
    categoryEmojis.forEach(emoji => {
        const emojiItem = document.createElement('div');
        emojiItem.className = 'emoji-item';
        emojiItem.textContent = emoji;
        emojiItem.addEventListener('click', () => {
            currentEmoji = emoji;
            emojiIcon.textContent = emoji;
            emojiIcon.classList.add('has-emoji');
            emojiModal.classList.add('hidden');
            
            // Clear other inputs
            textInput.value = '';
            currentImage = null;
            imageInput.value = '';
            
            updateFavicon();
        });
        emojiGrid.appendChild(emojiItem);
    });
}

// Initialize emoji picker
initEmojiPicker();

// Initial render
updateFavicon();

// Google Fonts
let googleFonts = [];
let currentFont = 'Inter';

// Add font caching
const fontCache = new Map();

// Fetch Google Fonts
async function fetchGoogleFonts() {
    try {
        const response = await fetch('https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBwIX97bVWr3-6AIUvGkcNnmFgirefZ6Sw');
        const data = await response.json();
        googleFonts = data.items.map(font => ({
            family: font.family,
            variants: font.variants,
            category: font.category
        }));
        initializeFontSelector();
    } catch (error) {
        console.error('Error fetching Google Fonts:', error);
    }
}

// Handle font loading with Font API to avoid CORS issues
async function loadGoogleFont(fontFamily) {
    // Skip loading for system fonts
    if (fontFamily === 'Arial' || fontFamily === 'Helvetica' || 
        fontFamily === 'Times New Roman' || fontFamily === 'Courier New') {
        return Promise.resolve();
    }

    // Check cache first
    if (fontCache.has(fontFamily)) {
        return Promise.resolve();
    }

    return new Promise((resolve) => {
        try {
            // Use proper Google Fonts URL format
            const formattedFontFamily = fontFamily.replace(/\s+/g, '+');
            const fontURL = `https://fonts.googleapis.com/css?family=${formattedFontFamily}&display=swap`;
            
            // Create a link element instead of using FontFace API
            const link = document.createElement('link');
            link.href = fontURL;
            link.rel = 'stylesheet';
            
            link.onload = () => {
                fontCache.set(fontFamily, true);
                console.log(`Successfully loaded font: ${fontFamily}`);
                resolve();
            };
            
            link.onerror = (err) => {
                console.warn(`Error loading font ${fontFamily}:`, err);
                // If the font fails to load, we'll use a fallback
                resolve();
            };
            
            document.head.appendChild(link);
        } catch (error) {
            console.warn(`Failed to load font: ${fontFamily}`, error);
            resolve(); // Continue anyway
        }
    });
}

// Preload fonts safely without CORS issues
function preloadFonts() {
    const systemFonts = [
        'Inter',
        'Arial',
        'Helvetica',
        'Times New Roman',
        'Courier New'
    ];
    
    // Preload system fonts
    systemFonts.forEach(font => fontCache.set(font, true));
}

// Initialize font selector with optimized rendering
function initializeFontSelector() {
    const fontSelect = document.getElementById('font-select');
    if (!fontSelect) return;

    // Preload fonts on initialization
    preloadFonts();

    // Add default system fonts
    const systemFonts = [
        { family: 'Inter', category: 'sans-serif' },
        { family: 'Arial', category: 'sans-serif' },
        { family: 'Helvetica', category: 'sans-serif' },
        { family: 'Times New Roman', category: 'serif' },
        { family: 'Courier New', category: 'monospace' }
    ];

    // Combine system fonts with Google Fonts
    const allFonts = [...systemFonts, ...googleFonts];

    // Group fonts by category
    const fontCategories = {
        'sans-serif': [],
        'serif': [],
        'display': [],
        'handwriting': [],
        'monospace': []
    };

    allFonts.forEach(font => {
        if (fontCategories[font.category]) {
            fontCategories[font.category].push(font);
        }
    });

    // Create font selector HTML
    fontSelect.innerHTML = '';
    Object.entries(fontCategories).forEach(([category, fonts]) => {
        if (fonts.length > 0) {
            const optgroup = document.createElement('optgroup');
            optgroup.label = category.charAt(0).toUpperCase() + category.slice(1);
            
            fonts.forEach(font => {
                const option = document.createElement('option');
                option.value = font.family;
                option.textContent = font.family;
                option.style.fontFamily = font.family;
                optgroup.appendChild(option);
            });
            
            fontSelect.appendChild(optgroup);
        }
    });

    // Set initial value
    fontSelect.value = currentFont;

    // Optimized font change handler
    fontSelect.addEventListener('change', async (e) => {
        const newFont = e.target.value;
        currentFont = newFont;
        
        // Start loading the font
        const fontLoadPromise = loadGoogleFont(newFont);
        
        // Update favicon immediately with a temporary font
        updateFavicon();
        
        // Wait for font to load and update again
        await fontLoadPromise;
        updateFavicon();
    });
}

// Initialize Google Fonts on load
fetchGoogleFonts(); 