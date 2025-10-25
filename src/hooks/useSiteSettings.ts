import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { SiteSettings, SiteSetting } from '../types';

export const useSiteSettings = () => {
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSiteSettings = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('id');

      if (error) throw error;

      // Transform the data into a more usable format
      const settings: SiteSettings = {
        site_name: data.find(s => s.id === 'site_name')?.value || 'Beracah Cafe',
        site_logo: data.find(s => s.id === 'site_logo')?.value || '',
        site_description: data.find(s => s.id === 'site_description')?.value || '',
        currency: data.find(s => s.id === 'currency')?.value || 'PHP',
        currency_code: data.find(s => s.id === 'currency_code')?.value || 'PHP',
        menu_heading: data.find(s => s.id === 'menu_heading')?.value || 'Our Menu',
        menu_description: data.find(s => s.id === 'menu_description')?.value || 'Messy Bite is a family-owned and a proud Cebuano homegrown restaurant.',
        menu_banner_image: data.find(s => s.id === 'menu_banner_image')?.value || ''
      };

      // If menu settings don't exist in database, create them
      if (!data.find(s => s.id === 'menu_heading')) {
        console.log('Creating menu settings in database...');
        try {
          await supabase
            .from('site_settings')
            .insert([
              { id: 'menu_heading', value: 'Our Menu', type: 'text', description: 'The main heading displayed on the menu page' },
              { id: 'menu_description', value: 'Messy Bite is a family-owned and a proud Cebuano homegrown restaurant.', type: 'text', description: 'The description text displayed below the menu heading' },
              { id: 'menu_banner_image', value: '', type: 'image', description: 'Banner image displayed at the top of the menu page' }
            ]);
          console.log('Menu settings created successfully');
        } catch (insertError) {
          console.error('Error creating menu settings:', insertError);
        }
      }

      // Check if menu_banner_image setting exists, create it if not
      if (!data.find(s => s.id === 'menu_banner_image')) {
        console.log('Creating menu_banner_image setting...');
        try {
          await supabase
            .from('site_settings')
            .insert([
              { id: 'menu_banner_image', value: '', type: 'image', description: 'Banner image displayed at the top of the menu page' }
            ]);
          console.log('menu_banner_image setting created successfully');
        } catch (insertError) {
          console.error('Error creating menu_banner_image setting:', insertError);
        }
      }
      
      setSiteSettings(settings);
    } catch (err) {
      console.error('Error fetching site settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch site settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSiteSetting = async (id: string, value: string) => {
    try {
      setError(null);

      const { error } = await supabase
        .from('site_settings')
        .update({ value })
        .eq('id', id);

      if (error) throw error;

      // Refresh the settings
      await fetchSiteSettings();
    } catch (err) {
      console.error('Error updating site setting:', err);
      setError(err instanceof Error ? err.message : 'Failed to update site setting');
      throw err;
    }
  };

  const updateSiteSettings = async (updates: Partial<SiteSettings>) => {
    try {
      setError(null);
      console.log('updateSiteSettings called with:', updates);

      const updatePromises = Object.entries(updates).map(([key, value]) => {
        console.log(`Updating ${key} with value:`, value);
        return supabase
          .from('site_settings')
          .update({ value })
          .eq('id', key);
      });

      const results = await Promise.all(updatePromises);
      
      // Check for errors
      const errors = results.filter(result => result.error);
      if (errors.length > 0) {
        throw new Error('Some updates failed');
      }

      // Refresh the settings
      await fetchSiteSettings();
    } catch (err) {
      console.error('Error updating site settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to update site settings');
      throw err;
    }
  };

  useEffect(() => {
    fetchSiteSettings();
  }, []);

  return {
    siteSettings,
    loading,
    error,
    updateSiteSetting,
    updateSiteSettings,
    refetch: fetchSiteSettings
  };
};
