import { searchFoodImage } from '../lib/unsplash';
import fs from 'fs/promises';
import path from 'path';

// 为每个菜品定制搜索关键词，使结果更准确
const dishes = [
  {
    name: "宫保鸡丁",
    searchTerms: "kung pao chicken diced chicken peanuts chinese spicy sichuan"
  },
  {
    name: "麻婆豆腐",
    searchTerms: "mapo tofu sichuan spicy soft tofu chinese"
  },
  {
    name: "糖醋里脊",
    searchTerms: "sweet and sour pork crispy chinese cantonese"
  },
  {
    name: "红烧狮子头",
    searchTerms: "braised meatballs chinese pork lion head shanghai"
  },
  {
    name: "清蒸鲈鱼",
    searchTerms: "steamed fish chinese sea bass cantonese fresh"
  },
  {
    name: "东坡肉",
    searchTerms: "dongpo pork braised pork belly chinese hangzhou"
  },
  {
    name: "水煮鱼",
    searchTerms: "sichuan boiled fish spicy chinese sliced fish"
  },
  {
    name: "佛跳墙",
    searchTerms: "buddha jumps over the wall chinese luxury soup abalone"
  },
  {
    name: "小笼包",
    searchTerms: "xiaolongbao soup dumplings steamed buns chinese dim sum"
  }
];

async function main() {
  const images: Record<string, { url: string; credit: { name: string; link: string } }> = {};

  for (const dish of dishes) {
    console.log(`Fetching image for ${dish.name}...`);
    const result = await searchFoodImage(dish.searchTerms);
    if (result) {
      images[dish.name] = result;
      console.log(`✓ Found image for ${dish.name}`);
    } else {
      console.log(`✗ No image found for ${dish.name}`);
    }
    // 添加延迟以避免超过 API 限制
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  const output = `// 这个文件是自动生成的，请不要手动修改
export const dishImages = ${JSON.stringify(images, null, 2)} as const;`;

  await fs.writeFile(
    path.join(process.cwd(), 'lib', 'dish-images.ts'),
    output,
    'utf-8'
  );

  console.log('Done! Images data has been saved to lib/dish-images.ts');
}

main().catch(console.error);
