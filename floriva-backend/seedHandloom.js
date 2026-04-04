require('dotenv').config();
const mongoose = require('mongoose');
const Handloom = require('./models/Handloom');

const data = [
  { name: "Banarasi Silk Saree - Royal Blue", category: "Sarees", price: 13500, originalPrice: 16000, location: "Varanasi, India", artisan: "Anjali Verma", images: ["https://res.cloudinary.com/deixioyzo/image/upload/v1775251991/banarsi_silk_saree.jpg_ez7dut.jpg"], tags: ["banarasi","silk saree","wedding","blue saree"] },
  { name: "Banarasi Silk Saree - Classic Red", category: "Sarees", price: 14000, originalPrice: 17000, location: "Varanasi, India", artisan: "Anjali Verma", images: ["https://res.cloudinary.com/deixioyzo/image/upload/v1775251990/banarsi_silk_saree1.jpg_ji20ii.jpg"], tags: ["banarasi","bridal saree","red saree"] },
  { name: "Banarasi Silk Saree - Purple Gold", category: "Sarees", price: 14500, originalPrice: 17500, location: "Varanasi, India", artisan: "Anjali Verma", images: ["https://res.cloudinary.com/deixioyzo/image/upload/v1775251989/banarsi_silk_saree2.jpg_gnjxpk.jpg"], tags: ["banarasi silk","luxury saree"] },
  { name: "Assam Silk Dupatta - White Red", category: "Dupattas", price: 4200, originalPrice: 5000, location: "Assam, India", artisan: "Rina Das", images: ["https://res.cloudinary.com/deixioyzo/image/upload/v1775251988/assam_dupatta.jpg_mpxcbf.jpg"], tags: ["assam silk","dupatta"] },
  { name: "Assam Silk Dupatta - Beige Pattern", category: "Dupattas", price: 4300, originalPrice: 5200, location: "Assam, India", artisan: "Rina Das", images: ["https://res.cloudinary.com/deixioyzo/image/upload/v1775251987/assam_dupatta2.jpg_amd8fc.jpg"], tags: ["traditional dupatta"] },
  { name: "Assam Silk Dupatta - Printed", category: "Dupattas", price: 4100, originalPrice: 4900, location: "Assam, India", artisan: "Rina Das", images: ["https://res.cloudinary.com/deixioyzo/image/upload/v1775251987/assam_dupatta3.jpg_nbt11c.jpg"], tags: ["ethnic wear"] },
  { name: "Chanderi Cotton Stole - Green", category: "Stoles", price: 1800, originalPrice: 2400, location: "Madhya Pradesh, India", artisan: "Sunita Patel", images: ["https://res.cloudinary.com/deixioyzo/image/upload/v1775251986/stole.jpg_kh1kts.jpg"], tags: ["chanderi","cotton stole"] },
  { name: "Chanderi Cotton Stole - Red Pattern", category: "Stoles", price: 1900, originalPrice: 2500, location: "Madhya Pradesh, India", artisan: "Sunita Patel", images: ["https://res.cloudinary.com/deixioyzo/image/upload/v1775251985/stole1.jpg_bzf15a.jpg"], tags: ["pattern stole"] },
  { name: "Chanderi Cotton Stole - Black Design", category: "Stoles", price: 2000, originalPrice: 2600, location: "Madhya Pradesh, India", artisan: "Sunita Patel", images: ["https://res.cloudinary.com/deixioyzo/image/upload/v1775251984/stole2.jpg_qsqxj6.jpg"], tags: ["modern stole"] },
  { name: "Ikat Table Runner - Green Blue", category: "Table Cloth", price: 2100, originalPrice: 2800, location: "Odisha, India", artisan: "Lakshmi Rao", images: ["https://res.cloudinary.com/deixioyzo/image/upload/v1775251962/tablecloth.jpg_ukdnpc.jpg"], tags: ["ikat","table decor"] },
  { name: "Ikat Table Runner - Pink Design", category: "Table Cloth", price: 2200, originalPrice: 2900, location: "Odisha, India", artisan: "Lakshmi Rao", images: ["https://res.cloudinary.com/deixioyzo/image/upload/v1775251963/tablecloth1.jpg_hw5evr.jpg"], tags: ["handloom tablecloth"] },
  { name: "Ikat Table Runner - Teal Pattern", category: "Table Cloth", price: 2300, originalPrice: 3000, location: "Odisha, India", artisan: "Lakshmi Rao", images: ["https://res.cloudinary.com/deixioyzo/image/upload/v1775251963/tablecloth3.jpg_wq8anj.jpg"], tags: ["ikat weave"] },
  { name: "Kashmiri Wool Carpet - Classic", category: "Carpets", price: 28000, originalPrice: 35000, location: "Kashmir, India", artisan: "Mohammad Ali", images: ["https://res.cloudinary.com/deixioyzo/image/upload/v1775251959/carpet.jpg_aldsqv.jpg"], tags: ["kashmir carpet"] },
  { name: "Kashmiri Wool Carpet - Blue", category: "Carpets", price: 30000, originalPrice: 37000, location: "Kashmir, India", artisan: "Mohammad Ali", images: ["https://res.cloudinary.com/deixioyzo/image/upload/v1775251960/carpet1.jpg_a5mhjz.jpg"], tags: ["luxury rug"] },
  { name: "Kashmiri Wool Carpet - Round Floral", category: "Carpets", price: 26000, originalPrice: 33000, location: "Kashmir, India", artisan: "Mohammad Ali", images: ["https://res.cloudinary.com/deixioyzo/image/upload/v1775251961/carpet2.jpg_rvmqth.jpg"], tags: ["round carpet"] },
  { name: "Handwoven Bed Linen - Pink Floral", category: "Bed Linen", price: 5600, originalPrice: 7000, location: "Jaipur, India", artisan: "Fatima Begum", images: ["https://res.cloudinary.com/deixioyzo/image/upload/v1775251957/bedsheet_4_white_and_pink_ugnze2.jpg"], tags: ["floral bedsheet"] },
  { name: "Handwoven Bed Linen - Blue", category: "Bed Linen", price: 5200, originalPrice: 6800, location: "Jaipur, India", artisan: "Fatima Begum", images: ["https://res.cloudinary.com/deixioyzo/image/upload/v1775251958/bedsheet_3_blue_inkrxh.jpg"], tags: ["blue bedding"] },
  { name: "Handwoven Bed Linen - Red Embroidery", category: "Bed Linen", price: 5400, originalPrice: 6900, location: "Jaipur, India", artisan: "Fatima Begum", images: ["https://res.cloudinary.com/deixioyzo/image/upload/v1775251958/bedsheet_2_red_vdakxt.jpg"], tags: ["embroidered"] },
  { name: "Handwoven Bed Linen - Beige Floral", category: "Bed Linen", price: 5000, originalPrice: 6500, location: "Jaipur, India", artisan: "Fatima Begum", images: ["https://res.cloudinary.com/deixioyzo/image/upload/v1775251958/bedsheet_1_beige_xdmiti.jpg"], tags: ["beige decor"] },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');
  await Handloom.deleteMany({});
  await Handloom.insertMany(data);
  console.log(`✅ Seeded ${data.length} handloom items!`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
