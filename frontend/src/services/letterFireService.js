import { db } from '../firebase/config';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  onSnapshot, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';

/**
 * Sends a letter by writing it to the 'letters' collection in Firestore.
 */
export async function sendLetterFirestore({ senderId, senderPenName, senderLocation, recipientId, content }) {
  const lettersRef = collection(db, 'letters');
  
  // Calculate delivery time (random 1-5 hours for demo realism, or based on preferences)
  const deliveryDelay = (1 + Math.random() * 4) * 3600000;
  const deliverAt = Date.now() + deliveryDelay;

  return addDoc(lettersRef, {
    senderId,
    senderPenName,
    senderLocation: senderLocation || 'Unknown Land',
    recipientId: recipientId || 'STATIONMASTER', // Fallback to a system bot if no recipient
    content,
    status: 'IN_TRANSIT',
    deliverAt,
    createdAt: serverTimestamp(),
  });
}

/**
 * Listens for incoming letters for a specific recipient.
 */
export function listenToMailbox(userId, callback) {
  const lettersRef = collection(db, 'letters');
  const q = query(
    lettersRef, 
    where('recipientId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const letters = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Ensure deliverAt is a number
      deliverAt: doc.data().deliverAt
    }));
    callback(letters);
  });
}

/**
 * Listens for sent letters for a specific sender.
 */
export function listenToSentBox(userId, callback) {
  const lettersRef = collection(db, 'letters');
  const q = query(
    lettersRef, 
    where('senderId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const letters = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(letters);
  });
}
