import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  User, 
  Phone, 
  
  Shield, 
  Download,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Define the types
export type DocumentStatus = 'Verified' | 'Pending' | 'Processing' | 'Rejected';

export interface DocumentInfoProps {
  documentInfo: {
    name: string;
    mobile: string;
    idNumber: string;
    email: string;
    documentType: string;
    period: string;
    status: DocumentStatus;
    dateUploaded?: string;
    fileSize?: string;
  };
  onDownload?: () => void;
  onViewDetails?: () => void;
}

const getStatusStyles = (status: DocumentStatus) => {
  switch(status) {
    case 'Verified':
      return 'bg-emerald-100 text-emerald-700';
    case 'Pending':
      return 'bg-amber-100 text-amber-700';
    case 'Processing':
      return 'bg-blue-100 text-blue-700';
    case 'Rejected':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const DocumentInfo: React.FC<DocumentInfoProps> = ({ 
  documentInfo, 
  onDownload, 
  onViewDetails 
}) => {
  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  const decorationVariants = {
    hidden: { scale: 0, opacity: 0 },
    show: { 
      scale: 1, 
      opacity: 1, 
      transition: { 
        duration: 0.8, 
        ease: [0.34, 1.56, 0.64, 1], // Custom spring-like ease
      } 
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative"
    >
      {/* Decorative background blur */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-blue-50 to-teal-50 rounded-3xl blur-xl opacity-70 transform -rotate-1"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 0.7, scale: 1 }}
        transition={{ duration: 0.8 }}
      />
      
      <Card className="relative overflow-hidden backdrop-blur-sm bg-white/90 rounded-3xl border border-teal-100 shadow-xl p-0">
        {/* Header with decorative elements */}
        <div className="relative pt-6 px-8 pb-4">
          <motion.div 
            className="absolute top-0 right-0 w-32 h-32 bg-teal-100/30 rounded-full -mr-10 -mt-10"
            variants={decorationVariants}
            initial="hidden"
            animate="show"
          />
          <motion.div 
            className="absolute top-0 left-0 w-16 h-16 bg-blue-100/30 rounded-full -ml-6 -mt-6"
            variants={decorationVariants}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.2 }}
          />
          
          <div className="flex items-center justify-between mb-2 relative z-10">
            <motion.div 
              className="flex items-center"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-600 to-teal-500 flex items-center justify-center shadow-md mr-4">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">
                  Document Information
                </h2>
                {documentInfo.dateUploaded && (
                  <p className="text-sm text-gray-500">Uploaded {documentInfo.dateUploaded}</p>
                )}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Badge 
                variant="secondary" 
                className={`px-5 py-1.5 text-sm font-medium rounded-full shadow-sm ${getStatusStyles(documentInfo.status)}`}
              >
                {documentInfo.status}
              </Badge>
            </motion.div>
          </div>
          
          <motion.div 
            className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mt-2"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          />
        </div>
        
        {/* Content section with animated info cards */}
        <motion.div 
          className="p-8 pt-4"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <InfoCard 
                icon={<User className="w-5 h-5 text-teal-600" />}
                label="Name"
                value={documentInfo.name}
                variants={itemVariants}
              />
              
              <InfoCard 
                icon={<Phone className="w-5 h-5 text-teal-600" />}
                label="Mobile"
                value={documentInfo.mobile}
                variants={itemVariants}
              />
              
              {/* <InfoCard 
                icon={<CreditCard className="w-5 h-5 text-teal-600" />}
                label="ID Number"
                value={documentInfo.idNumber}
                variants={itemVariants}
              /> */}
            </div>
            
            <div className="space-y-4">
              {/* <InfoCard 
                icon={<Mail className="w-5 h-5 text-teal-600" />}
                label="Email"
                value={documentInfo.email}
                variants={itemVariants}
              /> */}
              
              <InfoCard 
                icon={<FileText className="w-5 h-5 text-teal-600" />}
                label="Document Type"
                value={documentInfo.documentType}
                variants={itemVariants}
              />
              
              {/* <InfoCard 
                icon={<Calendar className="w-5 h-5 text-teal-600" />}
                label="Statement Period"
                value={documentInfo.period}
                variants={itemVariants}
              /> */}
            </div>
          </div>
          
          {/* Actions section */}
          <motion.div 
            className="mt-8 flex flex-wrap gap-4 justify-end"
            variants={itemVariants}
          >
            {documentInfo.fileSize && (
              <div className="flex items-center mr-auto text-sm text-gray-500">
                <Shield className="w-4 h-4 mr-1 text-teal-500" />
                <span>Secure file </span>
              </div>
            )}
            
            {onDownload && (
              <Button 
                variant="outline"
                size="sm"
                className="flex items-center gap-2 rounded-lg border-teal-200 text-teal-700 hover:bg-teal-50"
                onClick={onDownload}
              >
                <Download className="w-4 h-4" /> Download
              </Button>
            )}
            
            {onViewDetails && (
              <Button 
                size="sm"
                className="flex items-center gap-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white"
                onClick={onViewDetails}
              >
                <ExternalLink className="w-4 h-4" /> View Details
              </Button>
            )}
          </motion.div>
        </motion.div>
        
        {/* Bottom decorative element */}
        <motion.div 
          className="absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-tl from-teal-100/20 to-transparent rounded-full"
          variants={decorationVariants}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.4 }}
        />
      </Card>
    </motion.div>
  );
};

// InfoCard subcomponent for individual info items
interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  variants?: Variants;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon, label, value, variants }) => {
  return (
    <motion.div 
      variants={variants}
      className="group relative overflow-hidden rounded-xl border border-teal-50 hover:border-teal-200 bg-white shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="absolute top-0 left-0 h-full w-1.5 bg-teal-500/20 group-hover:bg-teal-500 transition-colors duration-300"></div>
      <div className="flex items-center p-4">
        <div className="flex-shrink-0 mr-4">
          <div className="w-10 h-10 rounded-full bg-teal-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="font-semibold text-gray-900 truncate">{value}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default DocumentInfo;