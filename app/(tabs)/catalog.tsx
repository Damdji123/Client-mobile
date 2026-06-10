import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api, { BASE_URL, getImageUrl } from '../../services/api';
import { ShoppingCart, Search } from 'lucide-react-native';
import { useCart } from '../../context/CartContext';
import { useRouter } from 'expo-router';
import Footer from '../../components/Footer';


const { width } = Dimensions.get('window');
const cardWidth = (width - 48 - 16) / 2;

export default function CatalogScreen() {
  const [medicines, setMedicines] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { fetchCartCount } = useCart();

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const res = await api.get('medicines/');
      setMedicines(res.data.results || res.data);
    } catch (error) {
      console.error("Failed to fetch catalog", error);
      Alert.alert("Error", "Could not load medicine catalog.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchMedicines();
  };

  const addToCart = async (med: any) => {
    try {
      await api.post('orders/cart/', { medicine_id: med.id, quantity: 1 });
      await fetchCartCount();
      Alert.alert("Success", `${med.name} added to cart!`);
    } catch (error: any) {
      console.error("Failed adding to cart", error);
      const msg = error.response?.data?.error || "Failed to add to cart.";
      Alert.alert("Error", msg);
    }
  };

  const filteredMedicines = medicines.filter((med: any) =>
    med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (med.description && med.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const renderMedicineItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.imageContainer}
        onPress={() => Alert.alert(item.name, item.description)} // Quick detail view
      >
        {item.image ? (
          <Image
            source={{ uri: getImageUrl(item.image) }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <ShoppingCart size={40} color="#cbd5e1" opacity={0.3} />
          </View>
        )}
        <View style={styles.priceBadge}>
          <Text style={styles.priceText}>UGX {parseFloat(item.price).toLocaleString()}</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.cardInfo}>
        <Text style={styles.medName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.medDesc} numberOfLines={2}>
          {item.description || 'No description available'}
        </Text>

        <TouchableOpacity
          style={[styles.addButton, item.stock <= 0 && styles.disabledButton]}
          onPress={() => addToCart(item)}
          disabled={item.stock <= 0}
        >
          <ShoppingCart size={16} color="#ffffff" />
          <Text style={styles.addButtonText}>
            {item.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Helper to chunk medicines into rows of 2
  const chunkData = (data: any[]) => {
    const rows = [];
    // Index 0: Title (Scrolls away)
    rows.push({ type: 'HEADER', id: 'HEADER' });
    // Index 1: Search Bar (Sticky)
    rows.push({ type: 'SEARCH', id: 'SEARCH' });

    // Medicines in rows of 2
    for (let i = 0; i < data.length; i += 2) {
      rows.push({
        type: 'ROW',
        id: `row-${i}`,
        items: data.slice(i, i + 2)
      });
    }
    return rows;
  };

  const renderItem = ({ item }: { item: any }) => {
    if (item.type === 'HEADER') {
      return (
        <View style={styles.header}>
          <Text style={styles.title}>Medical Catalog</Text>
          <Text style={styles.subtitle}>Find your medications easily</Text>
        </View>
      );
    }

    if (item.type === 'SEARCH') {
      return (
        <View style={styles.stickySearchWrapper}>
          <View style={styles.searchContainer}>
            <Search size={20} color="#94a3b8" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search medicine..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>
      );
    }

    return (
      <View style={styles.row}>
        {item.items.map((med: any) => (
          <View key={med.id} style={styles.card}>
            <TouchableOpacity
              style={styles.imageContainer}
              onPress={() => Alert.alert(med.name, med.description)}
            >
              {med.image ? (
                <Image
                  source={{ uri: getImageUrl(med.image) }}
                  style={styles.image}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <ShoppingCart size={40} color="#cbd5e1" opacity={0.3} />
                </View>
              )}
              <View style={styles.priceBadge}>
                <Text style={styles.priceText}>UGX {parseFloat(med.price).toLocaleString()}</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.cardInfo}>
              <Text style={styles.medName} numberOfLines={1}>{med.name}</Text>
              <Text style={styles.medDesc} numberOfLines={2}>
                {med.description || 'No description available'}
              </Text>

              <TouchableOpacity
                style={[styles.addButton, med.stock <= 0 && styles.disabledButton]}
                onPress={() => addToCart(med)}
                disabled={med.stock <= 0}
              >
                <ShoppingCart size={16} color="#ffffff" />
                <Text style={styles.addButtonText}>
                  {med.stock > 0 ? 'Add' : 'None'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
        {/* Fill empty space if row has only 1 item */}
        {item.items.length === 1 && <View style={{ width: cardWidth, margin: 8 }} />}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#033487" />
          <Text style={styles.loadingText}>Fetching Medicines...</Text>
        </View>
      ) : (
        <FlatList
          data={chunkData(filteredMedicines)}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          onRefresh={handleRefresh}
          refreshing={isRefreshing}
          stickyHeaderIndices={[1]} // Index 1 is the Search Bar
          ListFooterComponent={<Footer />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No medicines found matching "{searchQuery}"</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    padding: 24,
    paddingBottom: 10,
    backgroundColor: '#fff',
  },
  stickySearchWrapper: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingBottom: 15,
    paddingTop: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#033487',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#0f172a',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#64748b',
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  card: {
    width: cardWidth,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: 140,
    backgroundColor: '#f8fafc',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderTopLeftRadius: 16,
  },
  priceText: {
    fontWeight: '800',
    color: '#033487',
    fontSize: 14,
  },
  cardInfo: {
    padding: 12,
  },
  medName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  medDesc: {
    fontSize: 12,
    color: '#94a3b8',
    height: 32,
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: '#033487',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  disabledButton: {
    backgroundColor: '#cbd5e1',
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: 16,
  }
});
