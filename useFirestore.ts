import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, DocumentData, Query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/firebase';

export function useFirestore<T = DocumentData>(
  collectionName: string,
  queryConstraints: any[] = []
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const q = query(collection(db, collectionName), ...queryConstraints);
      
      const unsubscribe = onSnapshot(q, 
        (snapshot) => {
          const docs = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as T[];
          setData(docs);
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.error('Firestore error:', err);
          setError(err.message);
          setLoading(false);
        }
      );

      return unsubscribe;
    } catch (err) {
      console.error('Error setting up Firestore listener:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading(false);
    }
  }, [collectionName, JSON.stringify(queryConstraints)]);

  return { data, loading, error };
}
