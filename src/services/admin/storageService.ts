"use server";


import { getSupabase } from "@/lib/supabase";

export const uploadImageAction = async (formData: FormData, path: string): Promise<string> => {
  const file = formData.get("file") as File;
  if (!file) throw new Error("No file provided");

  const client = getSupabase();

  if (!client) {
    console.warn("Supabase credentials missing, returning mock URL");
    // Return a dummy URL for local development without Supabase configured
    // Cannot use URL.createObjectURL on the server, so returning a static placeholder
    return "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&q=80&w=400";
  }

  const bucketName = "florist-images";

  try {
    const { data: buckets, error: bucketsError } = await client.storage.listBuckets();
    if (bucketsError) {
      console.error("Error listing buckets:", bucketsError);
    } else {
      const bucketExists = buckets.some((b) => b.name === bucketName);
      if (!bucketExists) {
        console.log("Bucket does not exist, attempting to create...");
        const { error: createError } = await client.storage.createBucket(bucketName, { public: true });
        if (createError) {
          console.error("Error creating bucket:", createError);
          throw new Error(`Gagal membuat bucket otomatis: ${createError.message}. Pastikan Anda menggunakan Service Role Key, atau buat bucket 'florist-images' secara manual di Supabase Dashboard.`);
        }
      }
    }
  } catch (err: any) {
    console.error("Failed to check/create bucket", err);
    throw new Error(`Bucket check/creation failed: ${err.message}`);
  }

  const { data, error } = await client.storage
    .from(bucketName)
    .upload(`${path}/${Date.now()}-${file.name}`, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw new Error(`Failed to upload image: ${error.message}`);
  }

  const { data: publicUrlData } = client.storage
    .from(bucketName)
    .getPublicUrl(data.path);

  return publicUrlData.publicUrl;
};

export const removeImageAction = async (imageUrl: string): Promise<boolean> => {
  const client = getSupabase();
  if (!client) {
    return true; // Mock success if no client
  }

  try {
    const bucketName = "florist-images";
    
    // Extract the path from the URL
    // e.g. https://.../storage/v1/object/public/florist-images/products/123-file.png
    const urlParts = imageUrl.split(`/${bucketName}/`);
    if (urlParts.length !== 2) {
      console.warn("Invalid image URL format for deletion:", imageUrl);
      return false;
    }
    
    const filePath = urlParts[1];
    
    const { error } = await client.storage
      .from(bucketName)
      .remove([filePath]);
      
    if (error) {
      console.error("Failed to delete image from Supabase:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting image:", error);
    return false;
  }
};
