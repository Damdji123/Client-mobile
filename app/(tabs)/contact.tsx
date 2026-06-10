import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Linking, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Phone, MapPin, MessageCircle, Mail } from 'lucide-react-native';
import Footer from '../../components/Footer';

export default function ContactScreen() {
  const handleCall = (number: string) => Linking.openURL(`tel:${number}`);
  const handleWhatsApp = () => Linking.openURL('https://wa.me/+2694836476');
  const handleEmail = () => Linking.openURL('mailto:loutfipharmacy@gmail.com');

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerSection}>
          <Text style={styles.pageTitle}>Get In Touch</Text>
          <Text style={styles.subtitle}>
            We are here to assist with all your medical inquiries and delivery updates.
          </Text>
        </View>

        <View style={styles.content}>
          {/* Hero Icon/Image Area */}
          <View style={styles.illustrationContainer}>
            <View style={styles.circleDecoration} />
            <Image
              source={require('../../assets/images/logo.png')}
              style={styles.logoImg}
            />
          </View>

          <View style={styles.cardsContainer}>
            <TouchableOpacity style={styles.contactCard} onPress={() => handleCall('+256726600416')}>
              <View style={[styles.iconWrapper, { backgroundColor: '#f0fdf4' }]}>
                <Phone size={24} color="#10b981" />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>Call Us</Text>
                <Text style={styles.cardValue}>+269 4836476</Text>
                <Text style={styles.cardSubValue}>+269 3901515</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.contactCard} onPress={handleWhatsApp}>
              <View style={[styles.iconWrapper, { backgroundColor: '#ecfdf5' }]}>
                <MessageCircle size={24} color="#059669" />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>WhatsApp</Text>
                <Text style={styles.cardValue}>Chat with us instantly</Text>
                <Text style={styles.cardHint}>Fast replies on prescription requests.</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.contactCard} onPress={handleEmail}>
              <View style={[styles.iconWrapper, { backgroundColor: '#eff6ff' }]}>
                <Mail size={24} color="#3b82f6" />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>Email</Text>
                <Text style={styles.cardValue}>loutfipharmacy@gmail.com</Text>
                <Text style={styles.cardHint}>For business inquiries</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.contactCard}>
              <View style={[styles.iconWrapper, { backgroundColor: '#fdf4ff' }]}>
                <MapPin size={24} color="#d946ef" />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>Location</Text>
                <Text style={styles.cardValue}>Loutfi Pharmacy Mutsamudu Anjouan</Text>
                <Text style={styles.cardHint}>Mutsamudu, Anjouan, Comoros</Text>
              </View>
            </View>
          </View>
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
  headerSection: {
    padding: 24,
    paddingTop: 40,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#033487',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 8,
    lineHeight: 24,
  },
  content: {
    paddingHorizontal: 24,
  },
  illustrationContainer: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  circleDecoration: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#eff6ff',
    opacity: 0.5,
  },
  logoImg: {
    width: 100,
    height: 100,
  },
  cardsContainer: {
    gap: 16,
    marginBottom: 40,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  iconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
  },
  cardSubValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginTop: 2,
  },
  cardHint: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  }
});
