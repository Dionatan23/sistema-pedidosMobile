import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { api } from "../../services/api";
import { ModalPickers } from "../../components/ModalPickers";
import { ListItem } from "../../components/ListItem";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParams } from "../../routes/app.routes";

type RouteDetailParams = {
  Order: {
    order_id: string;
    number: number | string;
  };
};
type OrderRouteProps = RouteProp<RouteDetailParams, "Order">;

export type CategoryProp = {
  id: string;
  name: string;
};

type ProductsProps = {
  id: string;
  name: string;
};

type ItemsProps = {
  id: string;
  product_id: string;
  name: string;
  amount: string | number;
};

export default function Order() {
  const route = useRoute<OrderRouteProps>();
  const navigation = useNavigation<NativeStackNavigationProp<StackParams>>();

  const [category, setCategory] = useState<CategoryProp[] | []>([]);
  const [selectCategory, setselectCategory] = useState<
    CategoryProp | undefined
  >();
  const [modalVisible, setModalVisible] = useState(false);

  const [products, setProducts] = useState<ProductsProps[] | []>([]);
  const [productSelected, setProductSelected] = useState<
    ProductsProps | undefined
  >();
  const [modalProductVisible, setModalProductVisible] = useState(false);

  const [amount, setAmount] = useState("1");
  const [items, setItems] = useState<ItemsProps[]>([]);

  useEffect(() => {
    async function loadCategories() {
      const response = await api.get("/category");
      setCategory(response.data);
      setselectCategory(response.data[0]);
    }
    loadCategories();
  }, []);

  useEffect(() => {
    async function loadProducts() {
      const response = await api.get("/category/products", {
        params: {
          category_id: selectCategory?.id,
        },
      });

      // console.log("===============================");
      // console.log(response.data);
      setProducts(response.data);
      setProductSelected(response.data[0]);
    }

    loadProducts();
  }, [selectCategory]);

  async function handleCloseOrder() {
    try {
      await api.delete("/order", {
        params: {
          order_id: route.params.order_id,
        },
      });

      navigation.goBack();
    } catch (error) {
      console.log(error);
    }
  }

  function handleChangeCategory(item: CategoryProp) {
    setselectCategory(item);
  }

  function handleChangeProduct(item: ProductsProps) {
    setProductSelected(item);
  }
  // Add um produto a uma mesa
  async function handleAdd() {
    const response = await api.post("/additem", {
      order_id: route.params?.order_id,
      product_id: productSelected?.id,
      amount: Number(amount),
    });

    let data = {
      id: response.data.id,
      product_id: productSelected?.id as string,
      name: productSelected?.name as string,
      amount: amount,
    };

    setItems((oldArray) => [...oldArray, data]);
  }

  async function handleDeleteItem(item_id: string) {
    await api.delete("/removeitem", {
      params: {
        item_id: item_id,
      }
    })

    let removeitem = items.filter( item => {
      return (item.id !== item_id)
    })

    setItems(removeitem)
  }

  function handleFinishOrder() {
    navigation.navigate("FinishOrder", {number: route.params?.number, order_id: route.params?.order_id})
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mesa: {route.params.number}</Text>
        {items.length === 0 && (
          <TouchableOpacity onPress={handleCloseOrder}>
            <Feather name="trash-2" size={28} color="#ff3f4b" />
          </TouchableOpacity>
        )}
      </View>

      {category.length !== 0 && (
        <TouchableOpacity
          style={styles.input}
          onPress={() => setModalVisible(true)}
        >
          <Text style={{ color: "#fff" }}>{selectCategory?.name}</Text>
        </TouchableOpacity>
      )}

      {products.length !== 0 && (
        <TouchableOpacity
          style={styles.input}
          onPress={() => setModalProductVisible(true)}
        >
          <Text style={{ color: "#fff" }}>{productSelected?.name}</Text>
        </TouchableOpacity>
      )}

      <View style={styles.qtdContainer}>
        <Text style={styles.qtdText}>Quantidade</Text>
        <TextInput
          style={[styles.input, { width: "60%", textAlign: "center" }]}
          placeholderTextColor="#f0f0f0"
          value={amount}
          onChangeText={setAmount}
        />
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.buttonAdd} onPress={handleAdd}>
          <Text style={styles.btnText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { opacity: items.length === 0 ? 0.3 : 1 }]}
          disabled={items.length === 0}
          onPress={handleFinishOrder}
        >
          <Text style={styles.btnText}>Avançar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        showsVerticalScrollIndicator={false}
        style={{ flex: 1, marginTop: 22 }}
        data={items}
        keyExtractor={(items) => items.id}
        renderItem={({ item }) => <ListItem data={item} deleteItem={handleDeleteItem}/>}
      />

      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <ModalPickers
          handleCloseModal={() => setModalVisible(false)}
          options={category}
          selectedItem={handleChangeCategory}
        />
      </Modal>

      <Modal
        transparent={true}
        visible={modalProductVisible}
        animationType="fade"
      >
        <ModalPickers
          handleCloseModal={() => setModalProductVisible(false)}
          options={products}
          selectedItem={handleChangeProduct}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1d1d2e",
    paddingVertical: "5%",
    paddingEnd: "4%",
    paddingStart: "4%",
  },
  header: {
    flexDirection: "row",
    marginBottom: 12,
    marginTop: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
    marginRight: 14,
  },
  input: {
    backgroundColor: "#101026",
    borderRadius: 4,
    width: "100%",
    height: 40,
    marginBottom: 12,
    justifyContent: "center",
    paddingHorizontal: 8,
    color: "#fff",
    fontSize: 20,
  },
  qtdContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  qtdText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  actions: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonAdd: {
    width: "20%",
    backgroundColor: "#3fd1ff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    height: 40,
  },
  btnText: {
    color: "#101026",
    fontWeight: "bold",
    fontSize: 18,
  },
  button: {
    width: "75%",
    height: 40,
    backgroundColor: "#3fffa3",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
});
