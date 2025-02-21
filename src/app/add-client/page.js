"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Input,
  Select,
  SelectItem,
  Card,
  CardBody,
  CardHeader,
} from "@nextui-org/react";

export default function AddClientPage() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [experience, setExperience] = useState("Beginner");
  const [goal, setGoal] = useState("Losing Weight");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/add-client", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, age, gender, weight, height, experience, goal }),
      });

      if (response.ok) {
        alert("Client added successfully!");
        setName("");
        setAge("");
        setGender("Male");
        setWeight("");
        setHeight("");
        setExperience("Beginner");
        setGoal("Losing Weight");
        router.push("/");
      } else {
        alert("Failed to add client.");
      }
    } catch (error) {
      console.error("Error adding client:", error);
      alert("An error occurred while adding the client.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-16 px-6">
      {/* Page Title */}
      <h1 className="text-4xl font-bold text-[#010326] text-center">
        Add New Client
      </h1>
      <p className="text-[#07B0F2] text-center text-lg mt-2">
        Fill out the form to create a new client profile.
      </p>

      {/* Form Card */}
      <Card className="max-w-lg w-full mt-10 shadow-lg border border-gray-200 rounded-xl">
        <CardHeader className="text-lg font-semibold text-[#010326] text-center border-b border-gray-200 px-6 py-6">
          Client Information
        </CardHeader>

        <CardBody className="p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="block text-[#010326] font-semibold">
                Name
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                isRequired
                placeholder="Enter full name"
                className="w-full"
              />
            </div>

            {/* Age Field */}
            <div className="space-y-2">
              <label className="block text-[#010326] font-semibold">
                Age
              </label>
              <Input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                isRequired
                min="1"
                placeholder="Enter age"
                className="w-full"
              />
            </div>

            {/* Gender Dropdown */}
            <div className="space-y-2">
              <label className="block text-[#010326] font-semibold">
                Gender
              </label>
              <Select
                selectedKeys={[gender]}
                onSelectionChange={(keys) => setGender([...keys][0])}
                className="w-full bg-white text-black rounded-lg"
                popoverProps={{
                  className: "bg-white text-black shadow-md rounded-lg",
                }}
              >
                <SelectItem key="Male">Male</SelectItem>
                <SelectItem key="Female">Female</SelectItem>
              </Select>
            </div>

            {/* Weight Field */}
            <div className="space-y-2">
              <label className="block text-[#010326] font-semibold">
                Weight (kg)
              </label>
              <Input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                isRequired
                min="1"
                step="0.1"
                placeholder="Enter weight in kg"
                className="w-full"
              />
            </div>

            {/* Height Field */}
            <div className="space-y-2">
              <label className="block text-[#010326] font-semibold">
                Height (cm)
              </label>
              <Input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                isRequired
                min="1"
                step="0.1"
                placeholder="Enter height in cm"
                className="w-full"
              />
            </div>

            {/* Experience Level Dropdown */}
            <div className="space-y-2">
              <label className="block text-[#010326] font-semibold">
                Experience Level
              </label>
              <Select
                selectedKeys={[experience]}
                onSelectionChange={(keys) => setExperience([...keys][0])}
                className="w-full bg-white text-black rounded-lg"
                popoverProps={{
                  className: "bg-white text-black shadow-md rounded-lg",
                }}
              >
                <SelectItem key="Beginner">Beginner</SelectItem>
                <SelectItem key="Intermediate">Intermediate</SelectItem>
                <SelectItem key="Advanced">Advanced</SelectItem>
              </Select>
            </div>

            {/* Training Goal Dropdown */}
            <div className="space-y-2">
              <label className="block text-[#010326] font-semibold">
                Training Goal
              </label>
              <Select
                selectedKeys={[goal]}
                onSelectionChange={(keys) => setGoal([...keys][0])}
                className="w-full bg-white text-black rounded-lg"
                popoverProps={{
                  className: "bg-white text-black shadow-md rounded-lg",
                }}
              >
                <SelectItem key="Losing Weight">Losing Weight</SelectItem>
                <SelectItem key="Gaining Muscle">Gaining Muscle</SelectItem>
                <SelectItem key="Competing">Competing</SelectItem>
              </Select>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-[#F25922] text-white font-semibold py-3 rounded-lg hover:bg-[#cc4a1a] transition-all"
            >
              Add Client
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
