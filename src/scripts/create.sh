#! /usr/bin/bash

declare -r VBOXMANAGE=$1
declare -r VMNAME=$2
declare -r VDI=$3
declare -r ISO=$4
declare -i MEMORY=$5
declare -i CPU=$6
declare -i STORAGE=$7
declare -r IPADDR=$8

# Create Ubuntu-64 and define VM name
$VBOXMANAGE createvm --name $VMNAME --ostype Ubuntu_64 --register

# Enable NAT networking on nic 1
$VBOXMANAGE modifyvm $VMNAME --nic1 nat

# If IP address is set then add port forwarding
if [ ! -z "$IPADDR" -a "$IPADDR" != " " ]; then
  $VBOXMANAGE modifyvm $VMNAME --natpf1 "local,TCP,$IPADDR,8000,,8000"
fi 

# Enable HOST-ONLY network on nic 2
$VBOXMANAGE modifyvm $VMNAME --nic2 hostonly --hostonlyadapter2 "VirtualBox Host-Only Ethernet Adapter"

# Create memory allocation
$VBOXMANAGE modifyvm $VMNAME --memory $MEMORY

# Set number of processors
$VBOXMANAGE modifyvm $VMNAME --cpus $CPU

# Create hard disk
$VBOXMANAGE createmedium --filename $VDI --size $STORAGE --format VDI 

# Add SATA controller to attach to disk
$VBOXMANAGE storagectl $VMNAME --name "SATA Controller" --add sata --controller IntelAhci

# Attach virtual disk to SATA controller
$VBOXMANAGE storageattach $VMNAME --storagectl "SATA Controller" --port 0 --device 0 --type hdd --medium $VDI

# Add IDE controller for ISO
$VBOXMANAGE storagectl $VMNAME --name "IDE Controller" --add ide --controller PIIX4

# Attach ISO image to IDE controller
$VBOXMANAGE storageattach $VMNAME --storagectl "IDE Controller" --port 1 --device 0 --type dvddrive --medium $ISO

# Start VM
$VBOXMANAGE startvm $VMNAME