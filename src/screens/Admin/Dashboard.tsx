import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import { Card } from "../../components/CardMenu/CardMenuAdm";
import { styles } from "./styles";

const cardMenu = [
  {
    id: "1",
    title: "Compras",
    icon: "shopping-cart",
    description: "Gerencie suas compras",
  },

  {
    id: "2",
    title: "Vendas",
    icon: "attach-money",
    description: "Gerencie suas vendas",
  },

  {
    id: "3",
    title: "Estoque",
    icon: "inventory",
    description: "Gerencie seu estoque",
  },

  {
    id: "4",
    title: "Financeiro",
    icon: "account-balance",
    description: "Gerencie seu financeiro",
  },

  {
    id: "5",
    title: "Relatórios",
    icon: "bar-chart",
    description: "Acesse seus relatórios",
  },

  {
    id: "6",
    title: "Gestor",
    icon: "supervisor-account",
    description: "Gerencie seus gestores",
  }
];

const Dashboard: React.FC = () => {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        {cardMenu.map((item) => (
          <Card key={item.id} item={item} />
        ))}
      </ScrollView>
    );
  }

export default Dashboard;