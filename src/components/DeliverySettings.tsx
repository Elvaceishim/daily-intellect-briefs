
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Mail, Clock, Settings } from "lucide-react";
import { useState } from "react";

interface DeliverySettingsProps {
  deliveryTime: string;
  onTimeChange: (time: string) => void;
}

export const DeliverySettings = ({ deliveryTime, onTimeChange }: DeliverySettingsProps) => {
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [whatsappEnabled, setWhatsappEnabled] = useState(false);

  const timeOptions = [
    { value: '06:00', label: '6:00 AM' },
    { value: '07:00', label: '7:00 AM' },
    { value: '08:00', label: '8:00 AM' },
    { value: '09:00', label: '9:00 AM' },
    { value: '10:00', label: '10:00 AM' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Delivery Settings
        </CardTitle>
        <CardDescription>
          Configure when and how you receive your briefs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Delivery Time */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <label className="text-sm font-medium">Delivery Time</label>
          </div>
          <Select value={deliveryTime} onValueChange={onTimeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              {timeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500">
            Next brief: Tomorrow at {timeOptions.find(o => o.value === deliveryTime)?.label}
          </p>
        </div>

        {/* Delivery Methods */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-500" />
            <label className="text-sm font-medium">Delivery Methods</label>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-xs text-gray-500">user@example.com</p>
                </div>
              </div>
              <Switch checked={emailEnabled} onCheckedChange={setEmailEnabled} />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg opacity-60">
              <div className="flex items-center gap-3">
                <span className="text-lg">📱</span>
                <div>
                  <p className="text-sm font-medium">WhatsApp</p>
                  <p className="text-xs text-gray-500">Coming soon</p>
                </div>
              </div>
              <Switch checked={whatsappEnabled} onCheckedChange={setWhatsappEnabled} disabled />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3 pt-3 border-t border-gray-100">
          <Button variant="outline" size="sm" className="w-full">
            Send Test Brief
          </Button>
          <div className="flex gap-2">
            <Badge variant="secondary" className="flex-1 justify-center py-1">
              47 sent
            </Badge>
            <Badge variant="secondary" className="flex-1 justify-center py-1">
              98% delivered
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
