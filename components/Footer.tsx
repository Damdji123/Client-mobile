import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Linking, Image } from 'react-native';
import { MessageCircle, Mail } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function Footer() {
  const router = useRouter();

  const handleWhatsApp = () => {
    Linking.openURL('https://wa.me/256726600416');
  };

  const handleEmail = () => {
    Linking.openURL('mailto:damdjielyamine30@gmail.com');
  };

  return (
    <View style={styles.footerContainer}>
      {/* Top Banner Strip */}
      <View style={styles.bannerStrip}>
        <View style={styles.bannerLeft}>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logo}
          />
          <Text style={styles.bannerText}>
            Pharmacie <Text style={styles.bannerSpan}>Loutfi</Text>
          </Text>
        </View>
        <Text style={styles.bannerRight}>VOTRE SANTÉ <Text style={styles.boldText}>D'ABORD</Text></Text>
      </View>

      {/* Main Footer Content */}
      <View style={styles.footerMain}>
        <View style={styles.contentRow}>
          {/* Links Column */}
          <View style={styles.column}>
            <TouchableOpacity onPress={() => router.push('/(tabs)/about')}>
              <Text style={styles.footerLink}>À propos de nous</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/(tabs)/contact')}>
              <Text style={styles.footerLink}>Contact</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/(tabs)/feedback')}>
              <Text style={styles.footerLink}>Commentaires</Text>
            </TouchableOpacity>

            <View style={styles.careSection}>
              <Text style={styles.careTitle}>Service client</Text>
              <Text style={styles.careText}>
                Notre service client est ravi de recevoir vos appels, demandes et réclamations.
              </Text>
              <Text style={styles.careText}>Disponible de 7h à 22h, 7j/7.</Text>
            </View>
          </View>

          {/* Social/Numbers Column */}
          <View style={[styles.column, styles.alignRight]}>
            <Text style={styles.contactPoint}>Appelez-nous : +269 483593576</Text>
            <Text style={styles.contactPoint}>Ou : +269 3901515</Text>

            <View style={styles.socialRow}>
              <Text style={styles.socialLabel}>Discutez avec nous :</Text>
              <TouchableOpacity onPress={handleWhatsApp} style={styles.socialIcon}>
                <MessageCircle color="#25D366" size={24} />
              </TouchableOpacity>
            </View>

            <View style={styles.socialRow}>
              <Text style={styles.socialLabel}>Ou par e-mail :</Text>
              <TouchableOpacity onPress={handleEmail} style={styles.socialIcon}>
                <Mail color="#EA4335" size={24} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Bottom Copyright */}
        <Text style={styles.copyrightText}>
          Copyright par la Pharmacie Loutfi Mutsamudu Anjouan Comores {new Date().getFullYear()}. Tous droits réservés.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    width: '100%',
    marginTop: 20,
  },
  bannerStrip: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  bannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  bannerText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#033487',
  },
  bannerSpan: {
    color: '#10b981',
  },
  bannerRight: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
    letterSpacing: 1,
  },
  boldText: {
    fontWeight: '900',
    color: '#033487',
  },
  footerMain: {
    backgroundColor: '#81C784',
    padding: 24,
    paddingBottom: 40,
  },
  contentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  column: {
    flex: 1,
    gap: 8,
  },
  alignRight: {
    alignItems: 'flex-end',
  },
  footerLink: {
    color: '#111111',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  careSection: {
    marginTop: 16,
  },
  careTitle: {
    color: '#034694',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
  },
  careText: {
    color: '#333333',
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '500',
  },
  contactPoint: {
    color: '#111111',
    fontSize: 12,
    fontWeight: '700',
  },
  socialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  socialLabel: {
    color: '#333333',
    fontSize: 11,
    fontWeight: '600',
  },
  socialIcon: {
    backgroundColor: '#ffffff',
    padding: 8,
    borderRadius: 10,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginBottom: 16,
  },
  copyrightText: {
    color: '#333333',
    fontSize: 10,
    textAlign: 'center',
    fontWeight: '500',
  }
});
