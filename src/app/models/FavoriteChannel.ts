import { app, db } from '@/lib/firebase';
import { getAuth } from 'firebase/auth';
import { collection, deleteDoc, doc, getDocs, limit, query, setDoc, where } from 'firebase/firestore';

export interface FavoriteChannel {
  id: string;
  userId: string;
  channelId: string;
  channelTitle: string;
  channelThumbnail: string;
  description: string;
  customUrl?: string;
  createdAt: Date;
}

const COLLECTION_NAME = 'favoriteChannels';

export const favoriteChannelsCollection = collection(db, COLLECTION_NAME);

export async function addFavoriteChannel(channelData: Omit<FavoriteChannel, 'id' | 'userId' | 'createdAt'>) {
  const auth = getAuth(app);
  console.log('addFavoriteChannel: Starting', { 
    currentUser: auth.currentUser ? {
      uid: auth.currentUser.uid,
      email: auth.currentUser.email
    } : null 
  });

  if (!auth.currentUser) {
    console.error('addFavoriteChannel: No authenticated user');
    throw new Error('User must be authenticated');
  }

  try {
    const docRef = doc(favoriteChannelsCollection);
    const favoriteChannel: FavoriteChannel = {
      id: docRef.id,
      userId: auth.currentUser.uid,
      ...channelData,
      createdAt: new Date(),
    };
    
    console.log('addFavoriteChannel: Adding document', { 
      docId: docRef.id,
      userId: auth.currentUser.uid
    });
    
    await setDoc(docRef, favoriteChannel);
    console.log('addFavoriteChannel: Successfully added document');
    return favoriteChannel;
  } catch (error) {
    console.error('addFavoriteChannel: Error adding document:', error);
    throw error;
  }
}

export async function removeFavoriteChannel(channelId: string) {
  const auth = getAuth(app);
  console.log('removeFavoriteChannel: Starting', { 
    channelId,
    currentUser: auth.currentUser ? {
      uid: auth.currentUser.uid,
      email: auth.currentUser.email
    } : null 
  });

  if (!auth.currentUser) {
    console.error('removeFavoriteChannel: No authenticated user');
    throw new Error('User must be authenticated');
  }

  try {
    console.log('removeFavoriteChannel: Creating query');
    const q = query(
      favoriteChannelsCollection,
      where('userId', '==', auth.currentUser.uid),
      where('channelId', '==', channelId),
      limit(50)
    );
    
    console.log('removeFavoriteChannel: Executing query');
    const querySnapshot = await getDocs(q);
    
    console.log('removeFavoriteChannel: Found documents', { 
      count: querySnapshot.size 
    });
    
    const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    console.log('removeFavoriteChannel: Successfully removed documents');
  } catch (error) {
    console.error('removeFavoriteChannel: Error removing documents:', error);
    throw error;
  }
}

export async function getFavoriteChannels(): Promise<FavoriteChannel[]> {
  const auth = getAuth(app);
  console.log('getFavoriteChannels: Starting', { 
    currentUser: auth.currentUser ? {
      uid: auth.currentUser.uid,
      email: auth.currentUser.email
    } : null,
    authInitialized: auth.currentUser !== null
  });

  if (!auth.currentUser) {
    console.error('getFavoriteChannels: No authenticated user');
    throw new Error('User must be authenticated');
  }

  try {
    console.log('getFavoriteChannels: Creating query for user', auth.currentUser.uid);
    const q = query(
      favoriteChannelsCollection,
      where('userId', '==', auth.currentUser.uid),
      limit(50)
    );
    
    console.log('getFavoriteChannels: Executing query');
    const querySnapshot = await getDocs(q);
    
    console.log('getFavoriteChannels: Query completed', { 
      documentCount: querySnapshot.size,
      empty: querySnapshot.empty
    });
    
    const channels = querySnapshot.docs.map(doc => {
      const data = doc.data() as FavoriteChannel;
      console.log('getFavoriteChannels: Processing document', {
        id: doc.id,
        channelId: data.channelId,
        channelTitle: data.channelTitle
      });
      return data;
    });

    return channels;
  } catch (error) {
    console.error('getFavoriteChannels: Error fetching documents:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch favorite channels: ${error.message}`);
    }
    throw new Error('Failed to fetch favorite channels: Unknown error');
  }
} 