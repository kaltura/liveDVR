# installation of Python 2.7 on RHEL/CentOS 6:
rpm -ihv http://mirror.centos.org/centos/6/extras/x86_64/Packages/centos-release-scl-rh-2-3.el6.centos.noarch.rpm
yum install python27 -y
echo '. /opt/rh/python27/enable' >> /etc/profile.d/python.sh
echo run . /opt/rh/python27/enable to work with python 2.7 and not CentOS default
