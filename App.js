import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import axios from "axios";

const App = () => {
  // State cho danh sách user, form, loading và lỗi
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = "https://67dd047ae00db03c4069ce49.mockapi.io/Users";

  // Lấy danh sách user
  useEffect(() => {
    fetchUsers();
  }, []);

  // Hàm lấy danh sách user
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_URL);
      setUsers(response.data);
    } catch (err) {
      setError("Không thể lấy danh sách người dùng!");
      Alert.alert("Lỗi", "Không thể lấy danh sách người dùng!");
    } finally {
      setLoading(false);
    }
  };

  // Hàm thêm user mới
  const addUser = async () => {
    if (!name || !address || !email) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ tên, địa chỉ và email!");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(API_URL, {
        name,
        address,
        email,
      });
      // Thêm user mới vào danh sách
      setUsers([...users, response.data]);
      setName("");
      setAddress("");
      setEmail("");
      Alert.alert("Thành công", "Đã thêm người dùng!");
    } catch (err) {
      setError("Không thể thêm người dùng!");
      Alert.alert("Lỗi", "Không thể thêm người dùng!");
    } finally {
      setLoading(false);
    }
  };

  // Render item cho FlatList
  const renderItem = ({ item }) => (
    <View style={styles.userItem}>
      <Text style={styles.userText}>Tên: {item.name}</Text>
      <Text style={styles.userText}>Địa chỉ: {item.address}</Text>
      <Text style={styles.userText}>Email: {item.email}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quản lý người dùng</Text>

      {/* Form thêm user */}
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Nhập tên"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Nhập địa chỉ"
          value={address}
          onChangeText={setAddress}
        />
        <TextInput
          style={styles.input}
          placeholder="Nhập email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <Button title="Thêm người dùng" onPress={addUser} disabled={loading} />
      </View>

      {/* Hiển thị trạng thái loading */}
      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      {/* Hiển thị lỗi */}
      {error && <Text style={styles.error}>{error}</Text>}

      {/* Danh sách user */}
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text>Không có người dùng nào!</Text>}
        style={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  form: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  userItem: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: "#fff",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  userText: {
    fontSize: 16,
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  list: {
    flex: 1,
  },
});

export default App;
