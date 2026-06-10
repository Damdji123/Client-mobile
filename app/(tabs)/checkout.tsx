import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import Footer from '../../components/Footer';
import { CheckCircle, ShieldCheck } from 'lucide-react-native';

export default function CheckoutScreen() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('AIRTEL');
  const [paymentReference, setPaymentReference] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { fetchCartCount } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      fetchCheckoutCart();
    }, [])
  );

  const fetchCheckoutCart = async () => {
    try {
      const res = await api.get('orders/cart/');
      const items = res.data.results || res.data;
      if (items.length === 0) {
        router.replace('/(tabs)/cart');
      }
      setCartItems(items);
    } catch (error) {
      console.error("Fetch checkout cart error:", error);
      router.replace('/(tabs)/cart');
    } finally {
      setIsLoading(false);
    }
  };

  const subtotal = cartItems.reduce((sum: number, item: any) => {
    return sum + (parseFloat(item.medicine_detail?.price || 0) * item.quantity);
  }, 0);
  const deliveryFee = 15000;
  const total = subtotal + deliveryFee;

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      Alert.alert("Authentication Required", "Please log in to place an order.");
      return;
    }

    if (!address.trim()) {
      Alert.alert("Missing Information", "Please enter a delivery address.");
      return;
    }

    if ((paymentMethod === 'AIRTEL' || paymentMethod === 'MTN') && !paymentReference.trim()) {
      Alert.alert("Missing Information", "Please enter the Transaction Reference ID.");
      return;
    }

    setIsProcessing(true);

    try {
      // Loop through cart and create orders based on web reference
      for (const item of cartItems) {
        const orderPayload = {
          medicine: item.medicine_detail.id,
          quantity: item.quantity,
          payment_method: paymentMethod,
          payment_reference: paymentReference,
          payment_status: paymentMethod === 'CASH' ? 'UNPAID' : 'PENDING_VERIFICATION'
        };
        const orderRes = await api.post('orders/', orderPayload);
        const orderId = orderRes.data.id;

        // Post to delivery
        const deliveryPayload = {
          order: orderId,
          address: address
        };
        await api.post('delivery/', deliveryPayload);
      }

      // Clear the cart
      await api.delete('orders/cart/clear/');
      await fetchCartCount();

      Alert.alert(
        "Order Successful", 
        "Your order was placed successfully!",
        [{ text: "OK", onPress: () => router.push('/(tabs)/orders') }]
      );

    } catch (error) {
      console.error("Order Failed", error);
      Alert.alert("Order Failed", "Something went wrong. Make sure you are logged in.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#033487" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.pageTitle}>Secure Checkout</Text>

          {/* Secure Total Box */}
          <View style={styles.totalBox}>
            <CheckCircle color="#10B981" size={32} />
            <View style={styles.totalInfo}>
              <Text style={styles.totalLabel}>Total Amount to Pay</Text>
              <Text style={styles.totalValue}>UGX {total.toLocaleString()}</Text>
            </View>
          </View>

          {/* Delivery Details */}
          <View style={styles.formGroup}>
            <Text style={styles.sectionHeading}>Delivery Address</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Street, Building, Landmark..."
              value={address}
              onChangeText={setAddress}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* Payment Method */}
          <View style={styles.formGroup}>
            <Text style={styles.sectionHeading}>Select Payment Method</Text>

            <TouchableOpacity 
              style={[styles.radioCard, paymentMethod === 'AIRTEL' && styles.radioCardActive]}
              onPress={() => setPaymentMethod('AIRTEL')}
            >
              <View style={styles.radioInner}>
                <View style={styles.radioTextContainer}>
                  <Text style={styles.radioTitle}>Airtel Pay <Text style={styles.airtelHint}>USSD: *185*9#</Text></Text>
                  <Text style={styles.radioSub}>Secure Merchant Payment (Airtel Uganda)</Text>
                </View>
                {paymentMethod === 'AIRTEL' && <ShieldCheck color="#10B981" size={20} />}
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.radioCard, paymentMethod === 'MTN' && styles.radioCardActive]}
              onPress={() => setPaymentMethod('MTN')}
            >
              <View style={styles.radioInner}>
                <View style={styles.radioTextContainer}>
                  <Text style={styles.radioTitle}>MTN MoMoPay <Text style={styles.mtnHint}>USSD: *165*3#</Text></Text>
                  <Text style={styles.radioSub}>Secure Merchant Payment (MTN Uganda)</Text>
                </View>
                {paymentMethod === 'MTN' && <ShieldCheck color="#10B981" size={20} />}
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.radioCard, paymentMethod === 'CASH' && styles.radioCardActive]}
              onPress={() => setPaymentMethod('CASH')}
            >
              <View style={styles.radioInner}>
                <View style={styles.radioTextContainer}>
                  <Text style={styles.radioTitle}>Cash on Delivery</Text>
                  <Text style={styles.radioSub}>Pay when your medicine is delivered</Text>
                </View>
                {paymentMethod === 'CASH' && <ShieldCheck color="#10B981" size={20} />}
              </View>
            </TouchableOpacity>
          </View>

          {/* Instructions for Mobile Money */}
          {(paymentMethod === 'AIRTEL' || paymentMethod === 'MTN') && (
            <View style={styles.instructionsBox}>
              <Text style={styles.instructionsTitle}>Merchant Payment Instructions</Text>
              
              <View style={styles.instructionSteps}>
                <Text style={styles.stepText}>1. Dial <Text style={styles.bold}>{paymentMethod === 'MTN' ? '*165*3#' : '*185*9#'}</Text> on your phone</Text>
                <Text style={styles.stepText}>2. Enter {paymentMethod === 'MTN' ? 'Merchant ID' : 'Business Number'}: <Text style={styles.primaryText}>[MERCHANT_ID]</Text></Text>
                <Text style={styles.stepText}>3. Enter Amount: <Text style={styles.bold}>UGX {total.toLocaleString()}</Text></Text>
                <Text style={styles.stepText}>4. Enter your PIN to confirm</Text>
              </View>

              <View style={styles.refBox}>
                <Text style={styles.refTitle}>Enter Transaction Reference ID</Text>
                <Text style={styles.refSub}>Copy the Transaction ID from the SMS you receive after paying.</Text>
                <TextInput
                  style={styles.refInput}
                  placeholder="e.g. 192837465"
                  value={paymentReference}
                  onChangeText={setPaymentReference}
                />
              </View>
            </View>
          )}

          {/* Submit Button */}
          <TouchableOpacity 
            style={[styles.submitBtn, isProcessing && styles.submitBtnDisabled]}
            onPress={handleCheckout}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.submitBtnText}>
                {paymentMethod === 'CASH' ? 'Place Order & Pay Cash' : `I have paid UGX ${total.toLocaleString()}`}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 24,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 24,
  },
  totalBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    padding: 20,
    borderRadius: 12,
    marginBottom: 32,
    gap: 16,
  },
  totalInfo: {
    flex: 1,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
    lineHeight: 20,
  },
  totalValue: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0f172a',
    lineHeight: 32,
  },
  formGroup: {
    marginBottom: 28,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: '#1e293b',
  },
  textArea: {
    height: 100,
  },
  radioCard: {
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#ffffff',
  },
  radioCardActive: {
    borderColor: '#10B981',
    backgroundColor: '#f0fdf4',
  },
  radioInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  radioTextContainer: {
    flex: 1,
  },
  radioTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  airtelHint: {
    fontSize: 11,
    color: '#ef4444',
  },
  mtnHint: {
    fontSize: 11,
    color: '#f59e0b',
  },
  radioSub: {
    fontSize: 12,
    color: '#64748b',
  },
  instructionsBox: {
    backgroundColor: '#f8fafc',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 28,
  },
  instructionsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
    paddingBottom: 12,
    marginBottom: 16,
  },
  instructionSteps: {
    gap: 8,
    marginBottom: 24,
  },
  stepText: {
    fontSize: 14,
    color: '#0f172a',
    lineHeight: 22,
  },
  bold: {
    fontWeight: '700',
  },
  primaryText: {
    fontWeight: '700',
    color: '#033487',
  },
  refBox: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  refTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  refSub: {
    fontSize: 11,
    color: '#64748b',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  refInput: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    letterSpacing: 1,
    fontWeight: '600',
  },
  submitBtn: {
    backgroundColor: '#10B981',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: 16,
  },
  submitBtnDisabled: {
    opacity: 0.7,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
  }
});
