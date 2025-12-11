# EduVoice Notes - Quick Start Guide

## 🚀 Getting Started in 5 Minutes

This guide will help you get EduVoice Notes up and running quickly.

### Prerequisites Checklist

Before starting, make sure you have:
- [ ] Python 3.10 or higher installed
- [ ] Node.js 18 or higher installed  
- [ ] PostgreSQL 14 or higher installed and running
- [ ] Redis 7 or higher installed and running
- [ ] FFmpeg installed (for audio processing)

### Quick Installation

1. **Run the setup script:**
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```
   
   This will:
   - Create Python virtual environment
   - Install all dependencies
   - Set up database
   - Create configuration files
   - Generate startup scripts

2. **Configure your database:**
   
   Edit `eduvoice_backend/.env`:
   ```env
   DB_NAME=eduvoice_db
   DB_USER=eduvoice_user  
   DB_PASSWORD=your_password_here
   DB_HOST=localhost
   DB_PORT=5432
   ```

3. **Start all services:**
   ```bash
   ./start_all.sh
   ```
   
   Or start them separately (recommended):
   ```bash
   # Terminal 1 - Django
   ./start_backend.sh
   
   # Terminal 2 - Celery Worker
   ./start_celery.sh
   
   # Terminal 3 - React Frontend
   ./start_frontend.sh
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/api
   - Admin Panel: http://localhost:8000/admin
   - API Docs: http://localhost:8000/api/docs

### First Time Setup

1. **Create your account:**
   - Go to http://localhost:3000/register
   - Choose your role (Student or Teacher)
   - Complete registration

2. **Upload a document:**
   - Click "Upload" in the navigation
   - Drag and drop a PDF, DOCX, or TXT file
   - Add a title and optional description
   - Click "Upload Document"

3. **Convert to audio:**
   - Go to "Library" → "Documents"
   - Click on your uploaded document
   - Click "Convert to Audio"
   - Choose voice settings
   - Wait for conversion (usually 1-2 minutes)

4. **Listen to audio:**
   - Go to "Library" → "Audio Files"
   - Your converted audio will appear
   - Use the player to listen, adjust speed, download

### Common Issues & Solutions

#### Redis not running
```bash
# Ubuntu/Debian
sudo systemctl start redis-server

# macOS
brew services start redis

# Check if running
redis-cli ping  # Should return "PONG"
```

#### PostgreSQL not running
```bash
# Ubuntu/Debian
sudo systemctl start postgresql

# macOS
brew services start postgresql

# Check if running
psql --version
```

#### Port already in use
```bash
# Check what's using port 8000
lsof -i :8000

# Kill the process
kill -9 <PID>
```

#### FFmpeg not found
```bash
# Ubuntu/Debian
sudo apt-get install ffmpeg

# macOS
brew install ffmpeg

# Windows
# Download from https://ffmpeg.org/download.html
```

### Development Tips

1. **Hot reload is enabled** - Changes to code will auto-reload
2. **View logs** - Check terminal outputs for errors
3. **Use API docs** - http://localhost:8000/api/docs for testing
4. **Admin panel** - Create superuser to access admin features
5. **Sample data** - Load fixtures for testing

### Testing the Application

1. **Backend tests:**
   ```bash
   cd eduvoice_backend
   source venv/bin/activate
   python manage.py test
   ```

2. **API testing:**
   - Use http://localhost:8000/api/docs
   - Or use tools like Postman/Insomnia

3. **Frontend:**
   - Navigate through all pages
   - Test upload functionality
   - Try audio conversion
   - Check accessibility features

### Accessibility Features to Try

1. **High Contrast Mode:**
   - Click the moon/sun icon in navbar
   - Page switches to high contrast

2. **Font Size:**
   - Go to Profile → Settings
   - Change font size (small to extra-large)

3. **Keyboard Navigation:**
   - Press Tab to navigate
   - Press Enter/Space to activate
   - All features accessible via keyboard

4. **Screen Reader:**
   - Use with NVDA, JAWS, or VoiceOver
   - All elements have proper ARIA labels

### Next Steps

1. **Explore the Dashboard** - View statistics and recent activity
2. **Join Courses** - If you're a student, enroll in courses
3. **Create Courses** - If you're a teacher, create and manage courses
4. **Customize Preferences** - Set your default voice, speed, language
5. **Download Audio** - Save audio files for offline use

### Need Help?

- 📖 Check the full README.md for detailed documentation
- 🔍 Review API_DOCUMENTATION.md for API reference
- 🐛 Open an issue on GitHub
- 📧 Contact support@eduvoice.com

### Troubleshooting Commands

```bash
# Check Python version
python3 --version

# Check Node version
node --version

# Check if PostgreSQL is accessible
psql -U eduvoice_user -d eduvoice_db

# Check Redis connection
redis-cli ping

# View Django logs
cd eduvoice_backend
source venv/bin/activate
python manage.py runserver  # Watch for errors

# View Celery logs
celery -A eduvoice_backend worker -l info

# Clear Celery tasks
celery -A eduvoice_backend purge

# Run migrations
python manage.py migrate

# Create new superuser
python manage.py createsuperuser

# Reset database (WARNING: deletes all data)
python manage.py flush
```

Happy learning! 🎓
