import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import { useLanguage } from '@/contexts/language-context'

interface ExampleCardProps {
  name: string
  description: string
  price?: string
  tags?: string[]
  imageUrl: string
  language: string
}

function ExampleCard({ name, description, price, tags, imageUrl, language }: ExampleCardProps) {
  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent">
          <div className="absolute bottom-2 left-2 right-2">
            <span className="text-xl font-semibold text-white">{name}</span>
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold">{name}</h3>
          {price && <span className="text-primary font-medium">{price}</span>}
        </div>
        <p className="text-gray-600 text-sm mb-2">{description}</p>
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function MenuExamples() {
  const { language } = useLanguage();

  const examples = {
    zh: [
      {
        name: "宫保鸡丁",
        description: "经典川菜，鸡肉与花生的完美搭配，香辣可口",
        price: "￥38",
        tags: ["川菜", "辣", "招牌"],
        imageUrl: "/dishes/kungpao-chicken.jpg",
        language: "zh"
      },
      {
        name: "麻婆豆腐",
        description: "嫩滑豆腐配以麻辣香料，令人回味无穷",
        price: "￥32",
        tags: ["川菜", "麻辣", "素食可选"],
        imageUrl: "/dishes/mapo-tofu.jpg",
        language: "zh"
      },
      {
        name: "糖醋里脊",
        description: "外酥内嫩，酸甜可口的经典粤式小炒",
        price: "￥42",
        tags: ["粤菜", "甜", "招牌"],
        imageUrl: "/dishes/sweet-sour-pork.jpg",
        language: "zh"
      }
    ],
    fr: [
      {
        name: "Coq au Vin",
        description: "Poulet mijoté au vin rouge avec lardons et champignons",
        price: "€32",
        tags: ["Classique", "Viande", "Bourgogne"],
        imageUrl: "/dishes/coq-au-vin.jpg",
        language: "fr"
      },
      {
        name: "Bouillabaisse",
        description: "Soupe de poissons traditionnelle marseillaise",
        price: "€38",
        tags: ["Fruits de mer", "Provence", "Traditionnel"],
        imageUrl: "/dishes/bouillabaisse.jpg",
        language: "fr"
      },
      {
        name: "Ratatouille",
        description: "Légumes du sud mijotés à l'huile d'olive",
        price: "€24",
        tags: ["Végétarien", "Provence", "Santé"],
        imageUrl: "/dishes/ratatouille.jpg",
        language: "fr"
      }
    ],
    it: [
      {
        name: "Osso Buco",
        description: "Stinco di vitello brasato con gremolata",
        price: "€34",
        tags: ["Milano", "Carne", "Tradizionale"],
        imageUrl: "/dishes/osso-buco.jpg",
        language: "it"
      },
      {
        name: "Spaghetti Carbonara",
        description: "Pasta con uova, guanciale e pecorino",
        price: "€18",
        tags: ["Roma", "Pasta", "Classico"],
        imageUrl: "/dishes/carbonara.jpg",
        language: "it"
      },
      {
        name: "Pizza Margherita DOP",
        description: "Pizza con pomodoro, mozzarella di bufala e basilico",
        price: "€16",
        tags: ["Napoli", "Pizza", "DOP"],
        imageUrl: "/dishes/margherita.jpg",
        language: "it"
      }
    ]
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {examples[language].map((example) => (
        <ExampleCard key={example.name} {...example} />
      ))}
    </div>
  )
}
