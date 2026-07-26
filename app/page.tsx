'use client'

import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

type Dish = {
  id: number
  name: string
  price: number
  image_url: string
  is_available: boolean
}

export default function Home() {
  const [dishes, setDishes] = useState<Dish[]>([])

  useEffect(() => {
  fetchDishes()

  const channel = supabase
    .channel('dishes-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'dishes' },
      () => {
        fetchDishes()
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}, [])
  

  async function fetchDishes() {
    const { data, error } = await supabase.from('dishes').select('*')
    if (error) {
      console.log('Error fetching dishes:', error)
    } else {
      setDishes(data as Dish[])
    }
  }

  return (
    <main style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Our Menu</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
        {dishes.map((dish) => (
          <div key={dish.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem' }}>
            <img src={dish.image_url} alt={dish.name} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '6px' }} />
            <h2 style={{ fontSize: '1.2rem', margin: '0.5rem 0' }}>{dish.name}</h2>
            <p>₹{dish.price}</p>
            <p style={{ color: dish.is_available ? 'green' : 'red', fontWeight: 'bold' }}>
              {dish.is_available ? '✅ Available' : '❌ Out of Stock'}
            </p>
          </div>
        ))}
      </div>
    </main>
  )
}
