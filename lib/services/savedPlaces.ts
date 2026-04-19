import { createClient } from '@/lib/supabase/client';

export interface SavedPlace {
  id: string;
  user_id: string;
  place_name: string;
  place_id: string;
  category: string;
  created_at: string;
}

/**
 * Add a place to user's favorites in the database
 */
export async function savePlace(
  placeName: string,
  placeId: string,
  category: string
): Promise<SavedPlace | null> {
  try {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      console.error('[v0] User not authenticated');
      return null;
    }

    const { data, error } = await supabase.from('favorites').insert([
      {
        user_id: user.id,
        place_name: placeName,
        place_id: placeId,
        category,
      },
    ]);

    if (error) {
      console.error('[v0] Error saving place:', error);
      return null;
    }

    return data?.[0] || null;
  } catch (err) {
    console.error('[v0] Error saving place:', err);
    return null;
  }
}

/**
 * Remove a place from user's favorites
 */
export async function removeSavedPlace(placeId: string): Promise<boolean> {
  try {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      console.error('[v0] User not authenticated');
      return false;
    }

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('place_id', placeId);

    if (error) {
      console.error('[v0] Error removing saved place:', error);
      return false;
    }

    return true;
  } catch (err) {
    console.error('[v0] Error removing saved place:', err);
    return false;
  }
}

/**
 * Get all saved places for the current user
 */
export async function getUserSavedPlaces(): Promise<SavedPlace[]> {
  try {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      console.error('[v0] User not authenticated');
      return [];
    }

    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[v0] Error fetching saved places:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('[v0] Error fetching saved places:', err);
    return [];
  }
}

/**
 * Check if a place is saved by the current user
 */
export async function isPlaceSaved(placeId: string): Promise<boolean> {
  try {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return false;
    }

    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('place_id', placeId)
      .single();

    return !error && !!data;
  } catch (err) {
    console.error('[v0] Error checking if place is saved:', err);
    return false;
  }
}
