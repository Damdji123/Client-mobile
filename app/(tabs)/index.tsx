import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Dimensions, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Pill, ShoppingCart, ArrowRight, MessageSquare, ShieldCheck, Truck, Activity, Star } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Footer from '../../components/Footer';
import api from '../../services/api';
import Animated, { FadeInUp, FadeInRight, useAnimatedStyle, withRepeat, withTiming, withSequence } from 'react-native-reanimated';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const { user, isAuthenticated } = useAuth();
  const { cartCount } = useCart();
  const router = useRouter();
  const [medicines, setMedicines] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const res = await api.get('medicines/');
      const data = res.data.results || res.data;
      setMedicines(data);
    } catch (error) {
      console.error("Failed to fetch medicines for mobile home", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 2-minute rotation for featured medicine
  useEffect(() => {
    if (medicines.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % medicines.length);
    }, 120000);
    return () => clearInterval(interval);
  }, [medicines]);

  const featured = medicines[currentIndex];

  const renderMedicineCard = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.gridCard} 
      onPress={() => router.push('/(tabs)/catalog')}
    >
      <View style={styles.gridImageContainer}>
        <Image source={item.image} style={styles.gridImage} contentFit="cover" transition={300} />
      </View>
      <View style={styles.gridInfo}>
        <Text style={styles.gridName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.gridCategory}>{item.category}</Text>
        <View style={styles.gridFooter}>
          <Text style={styles.gridPrice}>UGX {parseFloat(item.price).toLocaleString()}</Text>
          <View style={styles.gridRating}>
            <Star size={12} color="#f59e0b" fill="#f59e0b" />
            <Text style={styles.ratingText}>4.8</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Web-style Hero Section */}
        <LinearGradient
          colors={['#574ff0e3', '#00E676']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <SafeAreaView edges={['top']}>
            <View style={styles.header}>
              <View>
                <Text style={styles.welcomeText}>Hello,</Text>
                <Text style={styles.userName}>{user?.first_name || 'Customer'}</Text>
              </View>
              {isAuthenticated && (
                <TouchableOpacity style={styles.cartBtn} onPress={() => router.push('/(tabs)/cart')}>
                  <ShoppingCart size={24} color="#fff" />
                  {cartCount > 0 && <View style={styles.cartBadge}><Text style={styles.cartBadgeText}>{cartCount}</Text></View>}
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.heroContent}>
              <Animated.View entering={FadeInUp.delay(200)} style={styles.heroTextContainer}>
                <Text style={styles.heroTitle}>Your Health,{"\n"}Digitally Refined.</Text>
                <Text style={styles.heroSubtitle}>Premium certified medicines delivered with surgical precision.</Text>
                <TouchableOpacity style={styles.shopBtn} onPress={() => router.push('/(tabs)/catalog')}>
                  <Text style={styles.shopBtnText}>Shop Now</Text>
                  <ArrowRight size={18} color="#033487" />
                </TouchableOpacity>
              </Animated.View>

              {/* Featured Card (Web-style) */}
              {featured && (
                <Animated.View entering={FadeInRight.delay(400)} style={styles.featuredCard}>
                  <View style={styles.featuredImageContainer}>
                    <Image source={featured.image} style={styles.featuredImage} contentFit="contain" transition={500} />
                  </View>
                  <View style={styles.featuredBadge}>
                    <Text style={styles.featuredBadgeText}>Featured</Text>
                  </View>
                  <Text style={styles.featuredName} numberOfLines={1}>{featured.name}</Text>
                  <Text style={styles.featuredPrice}>UGX {parseFloat(featured.price).toLocaleString()}</Text>
                </Animated.View>
              )}
            </View>
          </SafeAreaView>
        </LinearGradient>

        {/* Recent Activity Ticker */}
        <View style={styles.ticker}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tickerContent}>
            {[1, 2, 3].map((i) => (
              <View key={i} style={styles.tickerItem}>
                <Activity size={14} color="#10B981" />
                <Text style={styles.tickerText}>
                  Someone ordered <Text style={{ fontWeight: '700' }}>{medicines[(currentIndex + i) % medicines.length]?.name || 'Medicine'}</Text>
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Quick Actions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/catalog')}>
            <Text style={styles.seeAll}>View All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.categoryGrid}>
          {[
            { name: 'Medicines', icon: <Pill size={24} color="#2563eb" />, bg: '#eff6ff', route: '/(tabs)/catalog' },
            { name: 'Feedback', icon: <MessageSquare size={24} color="#ef4444" />, bg: '#fef2f2', route: '/(tabs)/feedback' },
            { name: 'Orders', icon: <Truck size={24} color="#10b981" />, bg: '#f0fdf4', route: '/(tabs)/orders' },
            { name: 'Support', icon: <ShieldCheck size={24} color="#f59e0b" />, bg: '#fffbeb', route: '/(tabs)/contact' }
          ].map((item, index) => (
            <TouchableOpacity key={index} style={styles.categoryItem} onPress={() => router.push(item.route as any)}>
              <View style={[styles.categoryIcon, { backgroundColor: item.bg }]}>
                {item.icon}
              </View>
              <Text style={styles.categoryText}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Medicines Grid */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Products</Text>
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color="#033487" style={{ marginVertical: 30 }} />
        ) : (
          <View style={styles.productsGrid}>
            {medicines.slice(0, 4).map((med) => (
              <React.Fragment key={med.id}>
                {renderMedicineCard({ item: med })}
              </React.Fragment>
            ))}
          </View>
        )}

        <Footer />
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  hero: {
    paddingBottom: 40,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  welcomeText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#fff',
  },
  cartBtn: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#ef4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#574ff0e3',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  heroContent: {
    paddingHorizontal: 24,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  heroTextContainer: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    lineHeight: 28,
  },
  heroSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 8,
    lineHeight: 16,
  },
  shopBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    alignSelf: 'flex-start',
  },
  shopBtnText: {
    color: '#033487',
    fontWeight: '700',
    fontSize: 14,
  },
  featuredCard: {
    width: 130,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  featuredImageContainer: {
    width: '100%',
    height: 80,
    backgroundColor: '#f8fafc',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredImage: {
    width: '80%',
    height: '80%',
  },
  featuredBadge: {
    backgroundColor: '#00E676',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 8,
  },
  featuredBadgeText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  featuredName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1e293b',
    marginTop: 4,
  },
  featuredPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: '#033487',
    marginTop: 2,
  },
  ticker: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  tickerContent: {
    paddingHorizontal: 24,
    gap: 30,
  },
  tickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tickerText: {
    fontSize: 12,
    color: '#64748b',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 25,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
  },
  seeAll: {
    fontSize: 14,
    color: '#574ff0e3',
    fontWeight: '600',
  },
  categoryGrid: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  categoryItem: {
    alignItems: 'center',
    gap: 8,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  gridCard: {
    width: (width - 48) / 2,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 16,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  gridImageContainer: {
    width: '100%',
    height: 120,
    backgroundColor: '#f8fafc',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  gridInfo: {
    padding: 12,
  },
  gridName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
  },
  gridCategory: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 2,
  },
  gridFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  gridPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: '#033487',
  },
  gridRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
  }
});


