#!/bin/bash
# Prisma migration script

echo "🗄️ Setting up database..."

# Create .env if it doesn't exist
if [ ! -f .env ]; then
  echo "DATABASE_URL=\"postgresql://user:password@localhost:5432/mindmap\"" > .env
  echo "Created .env (edit with your database credentials)"
fi

# Run migrations
echo "🔄 Running Prisma migrations..."
npx prisma migrate dev --name init

echo "✅ Database setup complete!"
echo ""
echo "🚀 Ready to start: npm start"
