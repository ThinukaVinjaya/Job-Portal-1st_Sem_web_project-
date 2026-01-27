// ========== AUTH DATABASE ==========
class AuthDatabase {
    constructor() {
        this.users = [];
        this.currentUser = null;
        this.loadFromStorage();
    }

    // Load users from localStorage (for persistence)
    loadFromStorage() {
        const storedUsers = localStorage.getItem('authUsers');
        if (storedUsers) {
            this.users = JSON.parse(storedUsers);
        }

        const storedCurrentUser = localStorage.getItem('currentUser');
        if (storedCurrentUser) {
            this.currentUser = JSON.parse(storedCurrentUser);
        }
    }

    // Save users to localStorage
    saveToStorage() {
        localStorage.setItem('authUsers', JSON.stringify(this.users));
        if (this.currentUser) {
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        } else {
            localStorage.removeItem('currentUser');
        }
    }

    // Register a new user
    register(userData) {
        // Check if user already exists
        const existingUser = this.users.find(user => user.email === userData.email);
        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        const newUser = {
            id: Date.now(),
            email: userData.email,
            password: userData.password, // In production, this should be hashed
            role: userData.role,
            fullName: userData.fullName || '',
            createdAt: new Date().toISOString(),
            profile: {
                title: '',
                bio: '',
                skills: [],
                experience: []
            },
            savedJobs: [],
            appliedJobs: [],
            jobAlerts: []
        };

        this.users.push(newUser);
        this.saveToStorage();
        return newUser;
    }

    // Login user
    login(email, password) {
        const user = this.users.find(user => user.email === email && user.password === password);
        if (!user) {
            throw new Error('Invalid email or password');
        }

        this.currentUser = {
            ...user,
            lastLogin: new Date().toISOString()
        };

        this.saveToStorage();
        return this.currentUser;
    }

    // Logout user
    logout() {
        this.currentUser = null;
        this.saveToStorage();
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Check if user is authenticated
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Update user profile
    updateProfile(profileData) {
        if (!this.currentUser) {
            throw new Error('No user logged in');
        }

        const userIndex = this.users.findIndex(user => user.id === this.currentUser.id);
        if (userIndex === -1) {
            throw new Error('User not found');
        }

        this.users[userIndex].profile = {
            ...this.users[userIndex].profile,
            ...profileData
        };

        this.currentUser = {
            ...this.currentUser,
            profile: this.users[userIndex].profile
        };

        this.saveToStorage();
        return this.currentUser;
    }

    // Save job for current user
    saveJob(jobId) {
        if (!this.currentUser) {
            throw new Error('No user logged in');
        }

        const userIndex = this.users.findIndex(user => user.id === this.currentUser.id);
        if (userIndex === -1) {
            throw new Error('User not found');
        }

        if (!this.users[userIndex].savedJobs.includes(jobId)) {
            this.users[userIndex].savedJobs.push(jobId);
            this.currentUser.savedJobs = this.users[userIndex].savedJobs;
            this.saveToStorage();
        }
    }

    // Remove saved job
    removeSavedJob(jobId) {
        if (!this.currentUser) {
            throw new Error('No user logged in');
        }

        const userIndex = this.users.findIndex(user => user.id === this.currentUser.id);
        if (userIndex === -1) {
            throw new Error('User not found');
        }

        this.users[userIndex].savedJobs = this.users[userIndex].savedJobs.filter(id => id !== jobId);
        this.currentUser.savedJobs = this.users[userIndex].savedJobs;
        this.saveToStorage();
    }

    // Apply for job
    applyForJob(jobId) {
        if (!this.currentUser) {
            throw new Error('No user logged in');
        }

        const userIndex = this.users.findIndex(user => user.id === this.currentUser.id);
        if (userIndex === -1) {
            throw new Error('User not found');
        }

        if (!this.users[userIndex].appliedJobs.includes(jobId)) {
            this.users[userIndex].appliedJobs.push(jobId);
            this.currentUser.appliedJobs = this.users[userIndex].appliedJobs;
            this.saveToStorage();
        }
    }

    // Add job alert
    addJobAlert(alertData) {
        if (!this.currentUser) {
            throw new Error('No user logged in');
        }

        const userIndex = this.users.findIndex(user => user.id === this.currentUser.id);
        if (userIndex === -1) {
            throw new Error('User not found');
        }

        const alert = {
            id: Date.now(),
            ...alertData,
            createdAt: new Date().toISOString()
        };

        this.users[userIndex].jobAlerts.push(alert);
        this.currentUser.jobAlerts = this.users[userIndex].jobAlerts;
        this.saveToStorage();
        return alert;
    }

    // Remove job alert
    removeJobAlert(alertId) {
        if (!this.currentUser) {
            throw new Error('No user logged in');
        }

        const userIndex = this.users.findIndex(user => user.id === this.currentUser.id);
        if (userIndex === -1) {
            throw new Error('User not found');
        }

        this.users[userIndex].jobAlerts = this.users[userIndex].jobAlerts.filter(alert => alert.id !== alertId);
        this.currentUser.jobAlerts = this.users[userIndex].jobAlerts;
        this.saveToStorage();
    }

    // Get user's saved jobs
    getSavedJobs() {
        return this.currentUser ? this.currentUser.savedJobs : [];
    }

    // Get user's applied jobs
    getAppliedJobs() {
        return this.currentUser ? this.currentUser.appliedJobs : [];
    }

    // Get user's job alerts
    getJobAlerts() {
        return this.currentUser ? this.currentUser.jobAlerts : [];
    }

    // Get user profile
    getProfile() {
        return this.currentUser ? this.currentUser.profile : null;
    }
}

// Create global instance
const authDB = new AuthDatabase();