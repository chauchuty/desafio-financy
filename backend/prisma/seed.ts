import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../generated/prisma/client.js";
import bcrypt from "bcrypt";

const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaBetterSqlite3({ url: connectionString });
const prisma = new PrismaClient({ adapter });

const USER_ID = "5c04501a-3d5f-4ca9-a79b-cf3b2a05e1c9";

const categories = [
  {
    name: "Alimentação",
    description: "Despesas com comida e refeições",
    color: "orange",
    icon: "utensils",
  },
  {
    name: "Transporte",
    description: "Gasolina, passagem e manutenção",
    color: "blue",
    icon: "car",
  },
  {
    name: "Salário",
    description: "Renda do trabalho",
    color: "emerald",
    icon: "briefcase",
  },
  {
    name: "Saúde",
    description: "Medicamentos e consultas médicas",
    color: "red",
    icon: "heart",
  },
  {
    name: "Lazer",
    description: "Diversão e entretenimento",
    color: "purple",
    icon: "smile",
  },
  {
    name: "Utilidades",
    description: "Água, luz, internet e outros",
    color: "slate",
    icon: "zap",
  },
];

const transactions = [
  { title: "Supermercado", amount: -320.50, type: "expense", categoryName: "Alimentação" },
  { title: "Restaurante", amount: -85.00, type: "expense", categoryName: "Alimentação" },
  { title: "Café da manhã", amount: -22.50, type: "expense", categoryName: "Alimentação" },
  { title: "Gasolina", amount: -180.00, type: "expense", categoryName: "Transporte" },
  { title: "Uber", amount: -45.90, type: "expense", categoryName: "Transporte" },
  { title: "Manutenção carro", amount: -450.00, type: "expense", categoryName: "Transporte" },
  { title: "Salário mensal", amount: 5000.00, type: "income", categoryName: "Salário" },
  { title: "Bônus trabalho", amount: 1200.00, type: "income", categoryName: "Salário" },
  { title: "Consulta médica", amount: -150.00, type: "expense", categoryName: "Saúde" },
  { title: "Farmácia", amount: -87.50, type: "expense", categoryName: "Saúde" },
  { title: "Dentista", amount: -300.00, type: "expense", categoryName: "Saúde" },
  { title: "Cinema", amount: -60.00, type: "expense", categoryName: "Lazer" },
  { title: "Jogo PS5", amount: -200.00, type: "expense", categoryName: "Lazer" },
  { title: "Streaming (Netflix)", amount: -29.90, type: "expense", categoryName: "Lazer" },
  { title: "Conta de água", amount: -120.00, type: "expense", categoryName: "Utilidades" },
  { title: "Conta de luz", amount: -280.00, type: "expense", categoryName: "Utilidades" },
  { title: "Internet", amount: -99.90, type: "expense", categoryName: "Utilidades" },
  { title: "Telefone", amount: -50.00, type: "expense", categoryName: "Utilidades" },
  { title: "Freelance projeto", amount: 800.00, type: "income", categoryName: "Salário" },
  { title: "Loja online venda", amount: 450.00, type: "income", categoryName: "Salário" },
];

async function main() {
  try {
    // Deleta dados antigos (transações e categorias primeiro por causa de foreign keys)
    await prisma.transaction.deleteMany({
      where: { userId: USER_ID },
    });
    await prisma.category.deleteMany({
      where: { userId: USER_ID },
    });
    await prisma.user.deleteMany({
      where: { id: USER_ID },
    });
    console.log("✓ Dados antigos removidos");

    // Cria novo usuário
    const hashedPassword = await bcrypt.hash("senha123", 10);
    const user = await prisma.user.create({
      data: {
        id: USER_ID,
        name: "Usuário Teste",
        email: "teste@financy.com",
        password: hashedPassword,
      },
    });
    console.log("✓ Novo usuário criado");

    // Cria categorias
    const createdCategories = await Promise.all(
      categories.map((cat) =>
        prisma.category.create({
          data: {
            ...cat,
            userId: USER_ID,
          },
        })
      )
    );
    console.log(`✓ ${createdCategories.length} categorias criadas`);

    // Cria transações
    const categoryMap = Object.fromEntries(
      createdCategories.map((cat) => [cat.name, cat.id])
    );

    const baseDate = new Date("2026-04-01");
    const createdTransactions = await Promise.all(
      transactions.map((trans, index) => {
        const transDate = new Date(baseDate);
        transDate.setDate(transDate.getDate() + (index % 30));

        return prisma.transaction.create({
          data: {
            title: trans.title,
            amount: trans.amount,
            type: trans.type,
            categoryId: categoryMap[trans.categoryName],
            userId: USER_ID,
            date: transDate,
          },
        });
      })
    );
    console.log(`✓ ${createdTransactions.length} transações criadas`);

    console.log("\n✅ Seed concluído com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao executar seed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
