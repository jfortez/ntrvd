# Node.js + tRPC + React Template

A complete full-stack template for modern applications using NestJS, tRPC, React, and cutting-edge technologies.

## 🚀 Tech Stack

### Backend

- **NestJS** - Scalable Node.js framework for APIs
- **tRPC** - Type-safe APIs with `nestjs-trpc`
- **Drizzle ORM** - Modern ORM for PostgreSQL
- **PostgreSQL** - Relational database
- **JWT** - Authentication with secure cookies
- **Zod** - Schema validation

### Frontend

- **React 19** - UI library
- **TanStack Router** - Type-safe routing
- **TanStack Query** - Server state management
- **TailwindCSS** - Utility-first CSS framework
- **TypeScript** - Static typing

### Tools

- **Turbo** - Monorepo build system
- **pnpm** - Fast package manager
- **ESLint + Prettier** - Linting and formatting

## 📁 Project Structure

```
├── apps/
│   ├── server/          # NestJS + tRPC backend
│   └── www/             # React frontend
├── packages/
│   ├── trpc/            # Shared tRPC client and types
│   ├── ui/              # Shared UI components
│   ├── eslint-config/   # ESLint configuration
│   └── typescript-config/ # TypeScript configuration
└── package.json         # Workspace configuration
```

## 🛠️ Installation and Setup

### Prerequisites

- Node.js >= 18
- pnpm >= 9.0.0
- Docker and Docker Compose (optional but recommended)

### 1. Clone and install dependencies

```bash
git clone <repository-url>
cd template-node-trpc-react
pnpm install
```

### 2. Configure database

```bash
# Copy environment variables
cp apps/server/.env.example apps/server/.env

# Edit apps/server/.env with your PostgreSQL credentials
DATABASE_URL="postgres://username:password@localhost:5432/database_name"
JWT_SECRET="your_jwt_secret_here"
```

### 3. Setup database

```bash
# Generate migrations
cd apps/server
pnpm db:generate

# Apply migrations
pnpm db:push

# Seed sample data (optional)
pnpm db:seed
```

### 4. Run in development

#### Option 1: Using Docker (Recommended)

```bash
# Start development services (PostgreSQL, Redis)
docker-compose -f docker-compose-dev.yml up -d

# Run the applications
pnpm dev
```

#### Option 2: Manual setup

```bash
# From project root
pnpm dev

# Or run individually:
# Backend: http://localhost:3000
cd apps/server && pnpm dev

# Frontend: http://localhost:5173
cd apps/www && pnpm dev
```

## 🔧 Backend Development

### Creating a New tRPC Router

1. **Create Drizzle schema** (`apps/server/src/database/schema/`)

```typescript
// apps/server/src/database/schema/posts.ts
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const postsTable = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Post = typeof postsTable.$inferSelect;
export type CreatePost = typeof postsTable.$inferInsert;
```

2. **Create Zod validation schemas** (`apps/server/src/posts/posts.schema.ts`)

```typescript
import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().optional(),
});

export const updatePostSchema = z.object({
  id: z.number(),
  title: z.string().min(1).optional(),
  content: z.string().optional(),
});
```

3. **Create service** (`apps/server/src/posts/posts.service.ts`)

```typescript
import { Injectable, Inject } from "@nestjs/common";
import { DATABASE_CONNECTION } from "@/database/database.provider";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { postsTable } from "@/database/schema/posts";
import { eq } from "drizzle-orm";

@Injectable()
export class PostsService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly database: NodePgDatabase
  ) {}

  async findAll() {
    return this.database.select().from(postsTable);
  }

  async findOne(id: number) {
    const [post] = await this.database.select().from(postsTable).where(eq(postsTable.id, id));
    return post;
  }

  async create(data: CreatePost) {
    const [post] = await this.database.insert(postsTable).values(data).returning();
    return post;
  }

  async update(id: number, data: Partial<CreatePost>) {
    const [post] = await this.database
      .update(postsTable)
      .set(data)
      .where(eq(postsTable.id, id))
      .returning();
    return post;
  }

  async remove(id: number) {
    await this.database.delete(postsTable).where(eq(postsTable.id, id));
    return true;
  }
}
```

4. **Create tRPC router** (`apps/server/src/posts/posts.router.ts`)

```typescript
import { Inject } from "@nestjs/common";
import { Router, Query, Mutation, Input, UseMiddlewares } from "nestjs-trpc";
import { PostsService } from "./posts.service";
import { z } from "zod";
import { createPostSchema, updatePostSchema } from "./posts.schema";
import { AuthMiddleware } from "@/middleware/auth.middleware";

@Router({ alias: "posts" })
export class PostsRouter {
  constructor(@Inject(PostsService) private readonly postsService: PostsService) {}

  @Query({
    output: z.array(
      z.object({
        id: z.number(),
        title: z.string(),
        content: z.string().nullable(),
        createdAt: z.date().nullable(),
      })
    ),
  })
  getPosts() {
    return this.postsService.findAll();
  }

  @Query({
    input: z.number(),
  })
  getPost(@Input() id: number) {
    return this.postsService.findOne(id);
  }

  @Mutation({
    input: createPostSchema,
  })
  @UseMiddlewares(AuthMiddleware) // Requires authentication
  createPost(@Input() data: z.infer<typeof createPostSchema>) {
    return this.postsService.create(data);
  }

  @Mutation({
    input: updatePostSchema,
  })
  @UseMiddlewares(AuthMiddleware)
  updatePost(@Input() data: z.infer<typeof updatePostSchema>) {
    const { id, ...updateData } = data;
    return this.postsService.update(id, updateData);
  }

  @Mutation({
    input: z.number(),
    output: z.boolean(),
  })
  @UseMiddlewares(AuthMiddleware)
  deletePost(@Input() id: number) {
    return this.postsService.remove(id);
  }
}
```

5. **Create module** (`apps/server/src/posts/posts.module.ts`)

```typescript
import { Module } from "@nestjs/common";
import { PostsService } from "./posts.service";
import { PostsRouter } from "./posts.router";

@Module({
  providers: [PostsService, PostsRouter],
})
export class PostsModule {}
```

6. **Register module** in `apps/server/src/app.module.ts`

```typescript
import { PostsModule } from "./posts/posts.module";

@Module({
  imports: [
    // ... other modules
    PostsModule,
  ],
})
export class AppModule {}
```

### Database Commands

```bash
# Generate migrations after schema changes
pnpm db:generate

# Apply changes to database
pnpm db:push

# Open Drizzle Studio (DB GUI)
pnpm db:studio

# Run seeds
pnpm db:seed
```

## 🎨 Frontend Development

### Using tRPC in React Components

The tRPC client is configured as a singleton and available globally:

```typescript
// apps/www/src/routes/posts.tsx
import { trpc } from "@/utils/trpc";
import { useQuery, useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/posts")({
  component: PostsComponent,
  loader: async ({ context: { trpc, queryClient } }) => {
    // Pre-load data in loader
    await queryClient.ensureQueryData(trpc.posts.getPosts.queryOptions());
  },
});

function PostsComponent() {
  // Query to get posts
  const { data: posts, isLoading } = useQuery(
    trpc.posts.getPosts.queryOptions()
  );

  // Mutation to create post
  const createPostMutation = useMutation(
    trpc.posts.createPost.mutationOptions({
      onSuccess: () => {
        // Invalidate cache to refresh data
        queryClient.invalidateQueries({
          queryKey: trpc.posts.getPosts.getQueryKey(),
        });
      },
    })
  );

  const handleCreatePost = (data: { title: string; content?: string }) => {
    createPostMutation.mutate(data);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {posts?.map((post) => (
          <li key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Creating New Routes with TanStack Router

```typescript
// apps/www/src/routes/posts/$postId.tsx
import { createFileRoute } from "@tanstack/react-router";
import { trpc } from "@/utils/trpc";

export const Route = createFileRoute("/posts/$postId")({
  component: PostDetailComponent,
  loader: async ({ params, context: { trpc, queryClient } }) => {
    const postId = Number(params.postId);
    await queryClient.ensureQueryData(
      trpc.posts.getPost.queryOptions(postId)
    );
  },
});

function PostDetailComponent() {
  const { postId } = Route.useParams();
  const { data: post } = useQuery(
    trpc.posts.getPost.queryOptions(Number(postId))
  );

  return (
    <div>
      <h1>{post?.title}</h1>
      <p>{post?.content}</p>
    </div>
  );
}
```

### Authentication Handling

```typescript
// Login example
const loginMutation = useMutation(
  trpc.auth.login.mutationOptions({
    onSuccess: () => {
      // Redirect after successful login
      router.navigate({ to: "/dashboard" });
    },
    onError: (error) => {
      console.error("Login error:", error.message);
    },
  })
);

const handleLogin = (credentials: { email: string; password: string }) => {
  loginMutation.mutate(credentials);
};
```

### Protected Routes

```typescript
// apps/www/src/routes/_authenticated.tsx
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context }) => {
    // Verify authentication
    try {
      await context.queryClient.ensureQueryData(context.trpc.user.me.queryOptions());
    } catch {
      throw redirect({ to: "/login" });
    }
  },
  component: AuthenticatedLayout,
});
```

## 📋 Useful Commands

```bash
# Development
pnpm dev                 # Run everything in development mode
pnpm build              # Build for production
pnpm lint               # Run linting
pnpm format             # Format code

# Backend specific
cd apps/server
pnpm dev                # Server in watch mode
pnpm db:studio          # Open Drizzle Studio
pnpm db:push            # Apply schema changes
pnpm db:generate        # Generate migrations

# Frontend specific
cd apps/www
pnpm dev                # Development server
pnpm build              # Build for production
```

## 🔍 tRPC Panel

The project includes `trpc-panel` to explore and test APIs:

- **URL**: http://localhost:3000/trpc-panel
- Allows testing all queries and mutations
- Useful for development and debugging

## 🔐 Authentication

The authentication system uses:

- **JWT tokens** stored in HTTP-only cookies
- **Authentication middleware** for protected routes
- **tRPC context** that includes user information

### Authentication Middleware

```typescript
// Use in routers that require authentication
@UseMiddlewares(AuthMiddleware)
```

## � Docker Setup

### Development Services

For local development, you can use Docker Compose to run the required services:

```bash
# Start development services (PostgreSQL, Redis)
docker-compose -f docker-compose-dev.yml up -d

# Stop development services
docker-compose -f docker-compose-dev.yml down
```

This will start:

- PostgreSQL database on port 5432
- Redis on port 6379

### Full Stack Deployment

To run the entire stack with Docker Compose:

```bash
# Build and start all services
docker-compose up --build

# Stop all services
docker-compose down

# Build and start in detached mode
docker-compose up --build -d
```

This will start:

- PostgreSQL database
- Redis
- Backend API on port 3000
- Frontend application on port 80

## �🚀 Deployment

### Production Environment Variables

```bash
DATABASE_URL="postgresql://..."
JWT_SECRET="your_secure_jwt_secret"
NODE_ENV="production"
```

### Build for Production

```bash
pnpm build
```

## 📚 Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [tRPC Documentation](https://trpc.io/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [TanStack Router](https://tanstack.com/router)
- [TanStack Query](https://tanstack.com/query)
- [TailwindCSS](https://tailwindcss.com/)

## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.
