import { createClient } from '@/lib/supabase/client';

export interface VendorProfile {
  id: string;
  user_id: string;
  business_name: string;
  business_category: string;
  whatsapp_number: string;
  description?: string;
  rating: number;
  reviews_count: number;
  photos: string[];
  verified: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Create a new vendor profile
 */
export async function createVendorProfile(
  vendorData: Omit<VendorProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>
): Promise<VendorProfile | null> {
  try {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      console.error('[v0] User not authenticated');
      return null;
    }

    const { data, error } = await supabase
      .from('vendors')
      .insert([
        {
          user_id: user.id,
          ...vendorData,
        },
      ])
      .select();

    if (error) {
      console.error('[v0] Error creating vendor profile:', error);
      return null;
    }

    return data?.[0] || null;
  } catch (err) {
    console.error('[v0] Error creating vendor profile:', err);
    return null;
  }
}

/**
 * Get vendor profile by user ID
 */
export async function getVendorProfile(userId: string): Promise<VendorProfile | null> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('[v0] Error fetching vendor profile:', error);
      return null;
    }

    return data || null;
  } catch (err) {
    console.error('[v0] Error fetching vendor profile:', err);
    return null;
  }
}

/**
 * Get current user's vendor profile
 */
export async function getCurrentUserVendorProfile(): Promise<VendorProfile | null> {
  try {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      console.error('[v0] User not authenticated');
      return null;
    }

    return getVendorProfile(user.id);
  } catch (err) {
    console.error('[v0] Error getting current user vendor profile:', err);
    return null;
  }
}

/**
 * Update vendor profile
 */
export async function updateVendorProfile(
  vendorId: string,
  updates: Partial<Omit<VendorProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
): Promise<VendorProfile | null> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('vendors')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', vendorId)
      .select();

    if (error) {
      console.error('[v0] Error updating vendor profile:', error);
      return null;
    }

    return data?.[0] || null;
  } catch (err) {
    console.error('[v0] Error updating vendor profile:', err);
    return null;
  }
}

/**
 * Get all vendors in a category
 */
export async function getVendorsByCategory(category: string): Promise<VendorProfile[]> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .eq('business_category', category)
      .eq('verified', true)
      .order('rating', { ascending: false });

    if (error) {
      console.error('[v0] Error fetching vendors by category:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('[v0] Error fetching vendors by category:', err);
    return [];
  }
}

/**
 * Get all vendors (verified only by default)
 */
export async function getAllVendors(onlyVerified: boolean = true): Promise<VendorProfile[]> {
  try {
    const supabase = createClient();

    let query = supabase.from('vendors').select('*');

    if (onlyVerified) {
      query = query.eq('verified', true);
    }

    const { data, error } = await query.order('rating', { ascending: false });

    if (error) {
      console.error('[v0] Error fetching vendors:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('[v0] Error fetching vendors:', err);
    return [];
  }
}

/**
 * Add a review/comment to a vendor
 */
export async function addVendorReview(
  vendorId: string,
  rating: number,
  comment: string
): Promise<boolean> {
  try {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      console.error('[v0] User not authenticated');
      return false;
    }

    const { error } = await supabase.from('vendor_comments').insert([
      {
        vendor_id: vendorId,
        user_id: user.id,
        rating: Math.min(5, Math.max(1, rating)),
        comment,
      },
    ]);

    if (error) {
      console.error('[v0] Error adding vendor review:', error);
      return false;
    }

    // Update vendor rating
    const vendorComments = await supabase
      .from('vendor_comments')
      .select('rating')
      .eq('vendor_id', vendorId);

    if (vendorComments.data) {
      const avgRating =
        vendorComments.data.reduce((sum: number, c: any) => sum + c.rating, 0) /
        vendorComments.data.length;

      await updateVendorProfile(vendorId, {
        rating: parseFloat(avgRating.toFixed(1)),
        reviews_count: vendorComments.data.length,
      });
    }

    return true;
  } catch (err) {
    console.error('[v0] Error adding vendor review:', err);
    return false;
  }
}

/**
 * Get reviews for a vendor
 */
export async function getVendorReviews(vendorId: string): Promise<any[]> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('vendor_comments')
      .select('*')
      .eq('vendor_id', vendorId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[v0] Error fetching vendor reviews:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('[v0] Error fetching vendor reviews:', err);
    return [];
  }
}
