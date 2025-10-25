import React, { useState } from 'react';
import { Save, Upload, X, Trash2 } from 'lucide-react';
import { useSiteSettings } from '../hooks/useSiteSettings';
import { useImageUpload } from '../hooks/useImageUpload';

const SiteSettingsManager: React.FC = () => {
  const { siteSettings, loading, updateSiteSettings } = useSiteSettings();
  const { uploadImage, uploading } = useImageUpload();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    site_name: '',
    site_description: '',
    currency: '',
    currency_code: '',
    menu_heading: '',
    menu_description: ''
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string>('');

  React.useEffect(() => {
    if (siteSettings) {
      setFormData({
        site_name: siteSettings.site_name,
        site_description: siteSettings.site_description,
        currency: siteSettings.currency,
        currency_code: siteSettings.currency_code,
        menu_heading: siteSettings.menu_heading,
        menu_description: siteSettings.menu_description
      });
      setLogoPreview(siteSettings.site_logo);
      setBannerPreview(siteSettings.menu_banner_image);
    }
  }, [siteSettings]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setBannerPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveBanner = () => {
    if (confirm('Are you sure you want to remove the banner image? This action cannot be undone.')) {
      setBannerFile(null);
      setBannerPreview('');
    }
  };

  const handleSave = async () => {
    try {
      let logoUrl = logoPreview;
      let bannerUrl = bannerPreview;
      
      console.log('Save process started:');
      console.log('bannerFile:', bannerFile);
      console.log('bannerPreview:', bannerPreview);
      console.log('siteSettings.menu_banner_image:', siteSettings?.menu_banner_image);
      
      // Upload new logo if selected
      if (logoFile) {
        const uploadedUrl = await uploadImage(logoFile, 'site-logo');
        logoUrl = uploadedUrl;
      }

      // Upload new banner if selected
      if (bannerFile) {
        console.log('Uploading new banner file...');
        const uploadedUrl = await uploadImage(bannerFile, 'menu-banner');
        bannerUrl = uploadedUrl;
        console.log('New banner URL:', bannerUrl);
      } else if (bannerPreview === '') {
        // If banner was removed, set to empty string
        console.log('Banner was removed, setting to empty string');
        bannerUrl = '';
      } else {
        // Keep the existing banner URL if no changes were made
        bannerUrl = siteSettings?.menu_banner_image || '';
        console.log('Keeping existing banner URL:', bannerUrl);
      }

      // Update all settings
      console.log('Updating settings with banner URL:', bannerUrl);
      await updateSiteSettings({
        site_name: formData.site_name,
        site_description: formData.site_description,
        currency: formData.currency,
        currency_code: formData.currency_code,
        menu_heading: formData.menu_heading,
        menu_description: formData.menu_description,
        site_logo: logoUrl,
        menu_banner_image: bannerUrl
      });
      console.log('Settings updated successfully');

      setIsEditing(false);
      setLogoFile(null);
      setBannerFile(null);
      alert('Site settings updated successfully!');
    } catch (error) {
      console.error('Error saving site settings:', error);
      alert('Failed to update site settings. Please try again.');
    }
  };

  const handleCancel = () => {
    if (siteSettings) {
      setFormData({
        site_name: siteSettings.site_name,
        site_description: siteSettings.site_description,
        currency: siteSettings.currency,
        currency_code: siteSettings.currency_code,
        menu_heading: siteSettings.menu_heading,
        menu_description: siteSettings.menu_description
      });
      setLogoPreview(siteSettings.site_logo);
      setBannerPreview(siteSettings.menu_banner_image);
    }
    setIsEditing(false);
    setLogoFile(null);
    setBannerFile(null);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h2 className="text-xl sm:text-2xl font-noto font-semibold text-black">Site Settings</h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center space-x-2 w-full sm:w-auto"
          >
            <Save className="h-4 w-4" />
            <span>Edit Settings</span>
          </button>
        ) : (
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
            <button
              onClick={handleCancel}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleSave}
              disabled={uploading}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{uploading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Site Logo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Site Logo
          </label>
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0 mx-auto sm:mx-0">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Site Logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-2xl text-gray-400">☕</div>
              )}
            </div>
            {isEditing && (
              <div className="flex justify-center sm:justify-start">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                  id="logo-upload"
                />
                <label
                  htmlFor="logo-upload"
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center space-x-2 cursor-pointer"
                >
                  <Upload className="h-4 w-4" />
                  <span>Upload Logo</span>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Site Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Site Name
          </label>
            {isEditing ? (
              <input
                type="text"
                name="site_name"
                value={formData.site_name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-base"
                placeholder="Enter site name"
              />
            ) : (
              <p className="text-base sm:text-lg font-medium text-black">{siteSettings?.site_name}</p>
            )}
        </div>

        {/* Site Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Site Description
          </label>
            {isEditing ? (
              <textarea
                name="site_description"
                value={formData.site_description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-base resize-none"
                placeholder="Enter site description"
              />
            ) : (
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{siteSettings?.site_description}</p>
            )}
        </div>

        {/* Currency Settings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Currency Symbol
            </label>
            {isEditing ? (
              <input
                type="text"
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-base"
                placeholder="e.g., ₱, $, €"
              />
            ) : (
              <p className="text-base sm:text-lg font-medium text-black">{siteSettings?.currency}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Currency Code
            </label>
            {isEditing ? (
              <input
                type="text"
                name="currency_code"
                value={formData.currency_code}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-base"
                placeholder="e.g., PHP, USD, EUR"
              />
            ) : (
              <p className="text-base sm:text-lg font-medium text-black">{siteSettings?.currency_code}</p>
            )}
          </div>
        </div>

        {/* Menu Settings */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Menu Page Settings</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Menu Heading
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="menu_heading"
                  value={formData.menu_heading}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-base"
                  placeholder="Enter menu heading"
                />
              ) : (
                <p className="text-base sm:text-lg font-medium text-black">{siteSettings?.menu_heading}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Menu Description
              </label>
              {isEditing ? (
                <textarea
                  name="menu_description"
                  value={formData.menu_description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-base resize-none"
                  placeholder="Enter menu description"
                />
              ) : (
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{siteSettings?.menu_description}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Menu Banner Image
                {!isEditing && (
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({siteSettings?.menu_banner_image ? 'Banner is set' : 'No banner'})
                  </span>
                )}
              </label>
              <div className="space-y-3">
                {/* Banner Preview */}
                <div className="relative">
                  <div className={`w-full h-24 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center ${isEditing ? 'border-2 border-dashed border-gray-300' : 'border border-gray-200'}`}>
                    {bannerPreview ? (
                      <div className="relative w-full h-full">
                        <img
                          src={bannerPreview}
                          alt="Menu Banner Preview"
                          className="w-full h-full object-cover"
                        />
                        {isEditing && (
                          <button
                            onClick={handleRemoveBanner}
                            className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors duration-200"
                            title="Remove banner"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="text-center text-gray-400">
                        <div className="text-2xl mb-1">🖼️</div>
                        <div className="text-sm">No banner image</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Upload Controls */}
                {isEditing && (
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleBannerChange}
                      className="hidden"
                      id="banner-upload"
                    />
                    <label
                      htmlFor="banner-upload"
                      className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center space-x-2 cursor-pointer flex-1"
                    >
                      <Upload className="h-4 w-4" />
                      <span>{bannerPreview ? 'Change Banner' : 'Upload Banner'}</span>
                    </label>
                    
                    {bannerPreview && (
                      <button
                        onClick={handleRemoveBanner}
                        className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors duration-200 flex items-center justify-center space-x-2 flex-1 sm:flex-none"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Remove</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Recommended: 3:1 aspect ratio (e.g., 1200x400px). Banner will appear at the top of the menu page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteSettingsManager;
