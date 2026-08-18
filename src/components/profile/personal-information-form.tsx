"use client";

import Image from "next/image";
import { Camera } from "lucide-react";

import { TextField } from "@/components/ui/text-field";

export function PersonalInformationForm() {
  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        <div className="relative size-[110px] shrink-0">
          <Image
            src="https://i.pravatar.cc/220?img=12"
            alt="Ammad Aslam"
            width={110}
            height={110}
            className="size-[110px] rounded-full object-cover"
          />
          <button
            type="button"
            aria-label="Change profile photo"
            className="absolute right-0.5 bottom-0.5 flex size-8 items-center justify-center rounded-full border-[3px] border-white bg-[#1a1a1a] text-white shadow-sm"
          >
            <Camera className="size-3.5" />
          </button>
        </div>
        <div>
          <h2 className="text-[22px] font-bold text-[#1e40af]">Ammad Aslam</h2>
          <p className="mt-1.5 text-[13px] text-[#9ca3af]">
            Supported Formats: PNG, JPG, JPEG. Max File Size: 2 MB.
          </p>
        </div>
      </div>

      <div className="grid gap-x-8 gap-y-6 md:grid-cols-2">
        <TextField
          label="Full Name"
          required
          defaultValue="Ammad Aslam"
          placeholder="Ammad Aslam"
        />
        <TextField
          label="Email Address"
          required
          type="email"
          defaultValue="ammadaslam@gmail.com"
          placeholder="ammadaslam@gmail.com"
        />
        <TextField
          label="Phone No"
          required
          defaultValue="0300-1234567"
          placeholder="0300-1234567"
        />
      </div>

      <section className="space-y-5">
        <h3 className="text-[16px] font-bold text-[#111111]">
          Personal Address
        </h3>
        <div className="grid gap-x-8 gap-y-6 md:grid-cols-2">
          <TextField
            label="Country Or Region"
            defaultValue="Pakistan"
            placeholder="Country Or Region"
          />
          <TextField label="City" defaultValue="Karachi" placeholder="City" />
          <TextField
            label="Address"
            defaultValue="Street 12, Block A"
            placeholder="Address"
          />
          <TextField
            label="Postal Code"
            defaultValue="75500"
            placeholder="Postal Code"
          />
        </div>
      </section>

      <section className="space-y-5">
        <h3 className="text-[16px] font-bold text-[#111111]">
          Social Information
        </h3>
        <div className="grid gap-x-8 gap-y-6 md:grid-cols-2">
          <TextField
            label="Facebook"
            defaultValue="facebook.com/username"
            placeholder="Facebook"
          />
          <TextField
            label="X"
            defaultValue="x.com/username"
            placeholder="X"
          />
          <TextField
            label="Linkedin"
            defaultValue="linkedin.com/in/username"
            placeholder="Linkedin"
          />
          <TextField
            label="Instagram"
            defaultValue="instagram.com/username"
            placeholder="Instagram"
          />
        </div>
      </section>

      <button
        type="button"
        className="inline-flex h-[48px] min-w-[168px] items-center justify-center rounded-full bg-[#e89b1e] px-8 text-[15px] font-semibold text-white transition hover:bg-[#d18b15]"
      >
        Save Changes
      </button>
    </div>
  );
}
