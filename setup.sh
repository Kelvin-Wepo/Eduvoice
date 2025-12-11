#!/bin/bash

# EduVoice Notes - Quick Setup Script

set -e  # Exit on error

echo "🎓 EduVoice Notes - Quick Setup"
echo "================================"
echo ""

# Check if required commands exist
command -v python3 >/dev/null 2>&1 || { echo "❌ Python 3 is required but not installed. Aborting." >&2; exit 1; }
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required but not installed. Aborting." >&2; exit 1; }
command -v redis-cli >/dev/null 2>&1 || { echo "⚠️  Warning: Redis is not installed. You'll need to install it separately." >&2; }

echo "✅ Prerequisites check passed"
echo ""

# Backend Setup
echo "📦 Setting up Backend..."
cd eduvoice_backend

# Create virtual environment
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "Installing Python dependencies..."
pip install -r requirements.txt

# Copy .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your database credentials"
fi

# Run migrations
echo "Running database migrations..."
python manage.py makemigrations
python manage.py migrate

# Create superuser (optional)
read -p "Do you want to create a superuser? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    python manage.py createsuperuser
fi

# Load sample data (optional)
read -p "Do you want to load sample data? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    python manage.py loaddata fixtures/sample_data.json
fi

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

cd ..

echo "✅ Backend setup complete!"
echo ""

# Frontend Setup
echo "📦 Setting up Frontend..."
cd eduvoice-frontend

# Install dependencies
echo "Installing Node.js dependencies..."
npm install

# Copy .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    cp .env.example .env || echo "VITE_API_URL=http://localhost:8000/api" > .env
fi

cd ..

echo "✅ Frontend setup complete!"
echo ""

# Create startup scripts
echo "📝 Creating startup scripts..."

# Backend startup script
cat > start_backend.sh << 'EOF'
#!/bin/bash
cd eduvoice_backend
source venv/bin/activate
python manage.py runserver
EOF
chmod +x start_backend.sh

# Celery worker startup script
cat > start_celery.sh << 'EOF'
#!/bin/bash
cd eduvoice_backend
source venv/bin/activate
celery -A eduvoice_backend worker -l info
EOF
chmod +x start_celery.sh

# Celery beat startup script
cat > start_celery_beat.sh << 'EOF'
#!/bin/bash
cd eduvoice_backend
source venv/bin/activate
celery -A eduvoice_backend beat -l info
EOF
chmod +x start_celery_beat.sh

# Frontend startup script
cat > start_frontend.sh << 'EOF'
#!/bin/bash
cd eduvoice-frontend
npm run dev
EOF
chmod +x start_frontend.sh

# All-in-one startup script
cat > start_all.sh << 'EOF'
#!/bin/bash
echo "Starting EduVoice Notes..."
echo ""

# Start backend in background
echo "Starting Django backend..."
./start_backend.sh &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 3

# Start Celery worker in background
echo "Starting Celery worker..."
./start_celery.sh &
CELERY_PID=$!

# Wait a bit
sleep 2

# Start frontend
echo "Starting React frontend..."
./start_frontend.sh

# When frontend exits, kill background processes
kill $BACKEND_PID $CELERY_PID 2>/dev/null
EOF
chmod +x start_all.sh

echo "✅ Startup scripts created!"
echo ""

# Final instructions
echo "🎉 Setup Complete!"
echo "=================="
echo ""
echo "To start the application:"
echo ""
echo "Option 1: Start all services together"
echo "  ./start_all.sh"
echo ""
echo "Option 2: Start services separately (recommended for development)"
echo "  Terminal 1: ./start_backend.sh"
echo "  Terminal 2: ./start_celery.sh"
echo "  Terminal 3: ./start_frontend.sh"
echo ""
echo "📝 Important Notes:"
echo "  - Make sure PostgreSQL is running"
echo "  - Make sure Redis is running (redis-server)"
echo "  - Edit .env files in both backend and frontend if needed"
echo "  - Frontend: http://localhost:3000"
echo "  - Backend API: http://localhost:8000/api"
echo "  - Admin Panel: http://localhost:8000/admin"
echo "  - API Docs: http://localhost:8000/api/docs"
echo ""
echo "Happy coding! 🚀"
