-- Create vendors table for Tiva-Maputo Digital Ambassador Program
CREATE TABLE IF NOT EXISTS vendors (
  id BIGSERIAL PRIMARY KEY,
  business_name VARCHAR(255) NOT NULL,
  business_category VARCHAR(100) NOT NULL,
  whatsapp_number VARCHAR(20) NOT NULL,
  description TEXT NOT NULL,
  photo_url_1 VARCHAR(500),
  photo_url_2 VARCHAR(500),
  photo_url_3 VARCHAR(500),
  rating DECIMAL(3,2) DEFAULT 5.0,
  review_count INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on business_category for efficient filtering
CREATE INDEX IF NOT EXISTS idx_vendors_category ON vendors(business_category);
CREATE INDEX IF NOT EXISTS idx_vendors_created_at ON vendors(created_at DESC);

-- Enable Row Level Security
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to view vendors
CREATE POLICY "Allow public read access to vendors" 
  ON vendors 
  FOR SELECT 
  USING (true);

-- Create policy to allow anyone to insert new vendors (for public vendor sign-ups)
CREATE POLICY "Allow public insert to vendors" 
  ON vendors 
  FOR INSERT 
  WITH CHECK (true);
