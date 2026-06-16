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
          <Text style={styles.pageTitle}>À propos de nous</Text>
          <Text style={styles.description}>
            À la Pharmacie Loutfi Comores, nous jouons un rôle clé dans la fourniture de soins de santé de qualité.
            Légalement enregistrés auprès de l'organisme de réglementation des professionnels de la pharmacie et
            du Conseil pharmaceutique général, nous sommes fiers de notre expertise dans les services
            médicaux et cliniques.
          </Text>
          <Text style={styles.description}>
            Pour le moins, nous mettons en pratique nos connaissances et vous conseillons sur
            les problèmes courants tels que la toux, le rhume, les courbatures et la douleur, ainsi que sur une alimentation
            et un mode de vie sains.
          </Text>

          <View style={styles.valuesCard}>
            <Text style={styles.subtitle}>EXCELLENCE MÉDICALE, SOINS COMPATISSANTS</Text>
            <Text style={styles.mainHeading}>Ce que nous défendons ?</Text>

            <Text style={styles.subHeading}>Nos valeurs fondamentales</Text>
            <Text style={styles.text}>
              Vous pouvez toujours compter sur l'aide de la Pharmacie Loutfi pour tous vos besoins médicaux.
            </Text>

            <Text style={styles.subHeading}>NOTRE MISSION</Text>
            <Text style={styles.text}>
              Nous fournissons des soins d'experts et des solutions innovantes en pharmacie et en soins de santé qui aident les gens à s'engager sur la voie d'une meilleure santé.
            </Text>

            <Text style={styles.subHeading}>NOS VALEURS</Text>
            <View style={styles.list}>
              <View style={styles.listItem}>
                <View style={styles.bullet} />
                <Text style={styles.listText}>
                  La <Text style={styles.bold}>prestation de services de qualité supérieure</Text> à nos clients est notre priorité.
                </Text>
              </View>
              <View style={styles.listItem}>
                <View style={styles.bullet} />
                <Text style={styles.listText}>
                  Une <Text style={styles.bold}>qualité de produit assurée</Text> et abordable, associée à des technologies innovantes.
                </Text>
              </View>
              <View style={styles.listItem}>
                <View style={styles.bullet} />
                <Text style={styles.listText}>
                  Des <Text style={styles.bold}>partenariats stratégiques</Text> avec d'autres prestataires de santé pour fournir des solutions de santé.
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
