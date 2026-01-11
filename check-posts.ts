import { prisma } from "./src/lib/prisma";

async function checkPosts() {
  try {
    const postCount = await prisma.post.count();
    console.log(`Total Posts: ${postCount}`);
    
    if (postCount > 0) {
      const posts = await prisma.post.findMany({ 
        take: 5,
        orderBy: { createdAt: 'desc' }
      });
      console.log("Recent Posts:", posts.map(p => ({ 
        id: p.id, 
        title: p.title, 
        authorId: p.authorId,
        createdAt: p.createdAt 
      })));
    }
  } catch (error) {
    console.error("Post check failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPosts();
