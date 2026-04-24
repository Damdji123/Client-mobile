import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Footer from '../../components/Footer';

export default function AboutScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Placeholder for Hero Image */}
        <View style={styles.heroContainer}>
          <Image 
            source={require('../../assets/images/logo.png')} 
            style={styles.heroImg}
            resizeMode="contain"
          />
        </View>

        {/* Content Section */}
        <View style={styles.contentSection}>
          <Text style={styles.pageTitle}>About Us</Text>
          <Text style={styles.description}>
            At Loutfi Pharmacy Uganda Limited we play a key role in providing quality healthcare.
            Being legally registered with the regulatory body of pharmacy professionals, and
            the General Pharmaceutical Council, we pride in our expertise in medical and clinical
            services.
          </Text>
          <Text style={styles.description}>
            To say the least, we exercise our practical knowledge and advise you on
            common problems such as coughs, colds, aches and pains, as well as healthy eating
            and living.
          </Text>

          <View style={styles.valuesCard}>
            <Text style={styles.subtitle}>MEDICAL EXCELLENCE, COMPASSIONATE CARE</Text>
            <Text style={styles.mainHeading}>What we stand for?</Text>
            
            <Text style={styles.subHeading}>Our core values</Text>
            <Text style={styles.text}>
              You can always count on Loutfi Pharmacy Uganda Limited's help with all your medical needs.
            </Text>

            <Text style={styles.subHeading}>OUR MISSION</Text>
            <Text style={styles.text}>
              We provide expert care and innovative solutions in pharmacy and health care that help put people on a path to better health.
            </Text>

            <Text style={styles.subHeading}>OUR VALUES</Text>
            <View style={styles.list}>
              <View style={styles.listItem}>
                <View style={styles.bullet} />
                <Text style={styles.listText}>
                  <Text style={styles.bold}>Top quality service delivery</Text> to our customers is our priority.
                </Text>
              </View>
              <View style={styles.listItem}>
                <View style={styles.bullet} />
                <Text style={styles.listText}>
                   <Text style={styles.bold}>Assured product quality</Text> and affordability coupled with innovative technologies.
                </Text>
              </View>
              <View style={styles.listItem}>
                <View style={styles.bullet} />
                <Text style={styles.listText}>
                  <Text style={styles.bold}>Strategic partnerships</Text> with other health providers to deliver health solutions.
                </Text>
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
  heroContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroImg: {
    width: 150,
    height: 150,
    opacity: 0.8,
  },
  contentSection: {
    padding: 24,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#033487',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#475569',
    lineHeight: 24,
    marginBottom: 16,
  },
  valuesCard: {
    backgroundColor: '#f1f5f9',
    borderRadius: 24,
    padding: 24,
    marginTop: 10,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#10b981',
    letterSpacing: 1,
    marginBottom: 8,
  },
  mainHeading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 20,
  },
  subHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#033487',
    marginTop: 20,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  text: {
    fontSize: 15,
    color: '#64748b',
    lineHeight: 22,
  },
  list: {
    marginTop: 12,
    gap: 12,
  },
  listItem: {
    flexDirection: 'row',
    gap: 12,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10b981',
    marginTop: 8,
  },
  listText: {
    flex: 1,
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },
  bold: {
    fontWeight: '700',
    color: '#1e293b',
  }
});
