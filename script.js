document.addEventListener('DOMContentLoaded', () => {
   
    const welcomeText = document.getElementById('welcomeText');
    const readMoreBtn = document.getElementById('readMoreBtn');
    if (welcomeText && readMoreBtn) {
        const text = 'Welcome to the New Freedom Worship Center';
        let index = 0;

        function type() {
            if (index < text.length) {
                welcomeText.textContent += text.charAt(index);
                index++;
                setTimeout(type, 70);
            } else {
                welcomeText.classList.add('visible');
                setTimeout(() => {
                    readMoreBtn.classList.add('visible');
                }, 500);
            }
        }

        setTimeout(() => {
            welcomeText.classList.add('visible');
            type();
        }, 500);

        readMoreBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector('#main-content');
            target.scrollIntoView({ behavior: 'smooth' });
            readMoreBtn.classList.add('hidden');
        });
    }

   
     const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const closeMenu = document.querySelector('.close-menu');
    if (hamburger && navMenu && closeMenu) {
        const toggleMenu = () => {
            console.log('Hamburger clicked, toggling menu');
            if (window.innerWidth <= 768) {
                navMenu.classList.toggle('active');
                console.log('Menu active:', navMenu.classList.contains('active'));
            }
        };

        const closeMenuAction = () => {
            console.log('Close button clicked, closing menu');
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('active');
                console.log('Menu active:', navMenu.classList.contains('active'));
            }
        };

        hamburger.addEventListener('click', toggleMenu);
        closeMenu.addEventListener('click', closeMenuAction);

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    navMenu.classList.remove('active');
                    console.log('Nav link clicked, menu closed');
                }
            });
        });

        window.addEventListener('resize', () => {
            console.log('Window resized, width:', window.innerWidth);
            if (window.innerWidth > 768) {
                navMenu.classList.remove('active');
                navMenu.style.display = 'flex';
            } else {
                navMenu.style.display = navMenu.classList.contains('active') ? 'flex' : 'none';
            }
        });
    } else {
        console.warn('Hamburger, nav-menu, or close-menu not found');
    }


    
    if (document.getElementById('videoSection')) {
        loadContent();
    }

    
    async function hashPassword(password) {
        try {
            const msgBuffer = new TextEncoder().encode(password);
            const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            return hash;
        } catch (error) {
            console.error('Error hashing password:', error);
            return null;
        }
    }

    async function handleLogin() {
        const username = document.getElementById('username')?.value;
        const password = document.getElementById('password')?.value;

        if (!username || !password) {
            alert('Please enter both username and password');
            return;
        }

        const hashedPassword = await hashPassword(password);

        if (!hashedPassword) {
            alert('Error hashing password. Please try again.');
            return;
        }

        const ADMIN_USERNAME = 'AMEN';
        const ADMIN_PASSWORD_HASH = 'a417c27e626d670b4b4285b76b6555b2dc3afd77dfc2fc17a8065c274163666d';

        if (username === ADMIN_USERNAME && hashedPassword === ADMIN_PASSWORD_HASH) {
            document.getElementById('loginPanel').classList.remove('active');
            document.getElementById('adminPanel').classList.add('active');
            loadAdminContent();
        } else {
            alert('Incorrect username or password');
        }
    }

    function loadAdminContent() {
        document.getElementById('agendaInput').value = localStorage.getItem('agenda') || '';
        document.getElementById('eventsInput').value = localStorage.getItem('events') || '';
        document.getElementById('messageBoardInput').value = localStorage.getItem('messageBoard') || '';
        document.getElementById('verseInput').value = localStorage.getItem('verse') || '';
        document.getElementById('youtubeUrl').value = localStorage.getItem('youtubeUrl') || '';
    }

    function saveContent() {
        const agenda = document.getElementById('agendaInput').value;
        const events = document.getElementById('eventsInput').value;
        const messageBoard = document.getElementById('messageBoardInput').value;
        const verse = document.getElementById('verseInput').value;
        const youtubeUrl = document.getElementById('youtubeUrl').value;
        const videoFile = document.getElementById('videoUpload').files[0];

        localStorage.setItem('agenda', agenda);
        localStorage.setItem('events', events);
        localStorage.setItem('messageBoard', messageBoard);
        localStorage.setItem('verse', verse);

        if (youtubeUrl) {
            localStorage.setItem('youtubeUrl', youtubeUrl);
            localStorage.removeItem('videoData');
            localStorage.removeItem('videoType');
        } else if (videoFile) {
            const reader = new FileReader();
            reader.onload = function(e) {
                localStorage.setItem('videoData', e.target.result);
                localStorage.setItem('videoType', videoFile.type);
                localStorage.removeItem('youtubeUrl');
            };
            reader.readAsDataURL(videoFile);
        } else {
            localStorage.removeItem('youtubeUrl');
            localStorage.removeItem('videoData');
            localStorage.removeItem('videoType');
        }

        alert('Content saved successfully!');
        document.getElementById('adminPanel').classList.remove('active');
        document.getElementById('loginPanel').classList.add('active');
    }

    function logout() {
        document.getElementById('adminPanel').classList.remove('active');
        document.getElementById('loginPanel').classList.add('active');
    }

    function togglePasswordVisibility() {
        const passwordInput = document.getElementById('password');
        const toggleBtn = document.getElementById('togglePasswordBtn');

        if (!passwordInput || !toggleBtn) {
            console.error('Password input or toggle button not found');
            return;
        }

        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleBtn.textContent = 'Hide Password';
        } else {
            passwordInput.type = 'password';
            toggleBtn.textContent = 'Show Password';
        }
    }

    function loadContent() {
        const agenda = localStorage.getItem('agenda') || 'No agenda available.';
        const events = localStorage.getItem('events') || 'No upcoming events.';
        const messageBoard = localStorage.getItem('messageBoard') || 'No messages available.';
        const verse = localStorage.getItem('verse') || 'No verse available.';
        const youtubeUrl = localStorage.getItem('youtubeUrl');
        const videoData = localStorage.getItem('videoData');
        const videoType = localStorage.getItem('videoType');

        document.getElementById('agendaContent').innerHTML = agenda.replace(/\n/g, '<br>');
        document.getElementById('eventsContent').innerHTML = events.replace(/\n/g, '<br>');
        document.getElementById('messageBoardContent').innerHTML = messageBoard.replace(/\n/g, '<br>');
        document.getElementById('verseContent').innerHTML = verse.replace(/\n/g, '<br>');
        
        const videoSection = document.getElementById('videoSection');
        if (youtubeUrl) {
            let videoId = null;
            if (youtubeUrl.includes('youtube.com/watch?v=')) {
                videoId = youtubeUrl.split('v=')[1]?.split('&')[0];
            } else if (youtubeUrl.includes('youtu.be/')) {
                videoId = youtubeUrl.split('youtu.be/')[1]?.split('?')[0];
            }

            if (videoId) {
                videoSection.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`;
                videoSection.classList.add('active');
                console.log('YouTube Video ID:', videoId);
            } else {
                console.error('Invalid YouTube URL format:', youtubeUrl);
                videoSection.classList.remove('active');
            }
        } else if (videoData && videoType) {
            videoSection.innerHTML = `<video controls><source src="${videoData}" type="${videoType}"></video>`;
            videoSection.classList.add('active');
        } else {
            videoSection.classList.remove('active');
        }

        document.getElementById('contentSection')?.classList.toggle('full-width', !videoSection.classList.contains('active'));
    }

    
    window.handleLogin = handleLogin;
    window.saveContent = saveContent;
    window.logout = logout;
    window.togglePasswordVisibility = togglePasswordVisibility;
});



