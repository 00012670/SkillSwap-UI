import { Component } from '@angular/core';
import { GetSwapRequest, Status, UpdateSwapRequest } from 'src/app/models/request.model';
import { RequestService } from 'src/app/services/request.service';
import { AuthService } from 'src/app/services/auth.service';
import { NgToastService } from 'ng-angular-popup';
import { SearchService } from 'src/app/services/search.service';
import { ThemeService } from 'src/app/services/theme.service';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-manage-requests',
  templateUrl: './manage-requests.component.html',
  styleUrls: ['./manage-requests.component.scss']
})
export class ManageRequestsComponent {

  searchText: any;

  receivedSwapRequests: GetSwapRequest[] = [];
  sentSwapRequests: GetSwapRequest[] = [];
  Status = Status;
  skill: any;
  role!: string;

  constructor(
    private requestService: RequestService,
    private authService: AuthService,
    private toast: NgToastService,
    private searchService: SearchService,
    public themeService: ThemeService,
    private userStore: UserStoreService
  ) { }

  ngOnInit() {
    this.userStore.getRoleFromStore().subscribe(val => {
      this.role = val || this.authService.getRoleFromToken();
      this.loadDataBasedOnRole();
    });
    this.searchService.currentSearchText.subscribe(searchText => this.searchText = searchText);
  }

  loadDataBasedOnRole(): void {
    if (this.role === 'Admin') {
      this.loadAllRequests();
    } else if (this.role === 'User') {
      this.loadRequests();
      this.loadSentRequests();
    }
  }

  loadRequests(): void {
    const userId = this.authService.getUserId();
    this.requestService.getSwapRequests(userId).subscribe(requests => {
      this.receivedSwapRequests = requests;
    });
  }

  loadSentRequests(): void {
    const userId = this.authService.getUserId();
    this.requestService.getSentSwapRequests(userId).subscribe(requests => {
      this.sentSwapRequests = requests;
    });
  }

  loadAllRequests(): void {
    this.requestService.getAllSwapRequests().subscribe(requests => {
      this.receivedSwapRequests = requests;
    });
  }

  acceptRequest(request: GetSwapRequest) {
    const updatedRequest: UpdateSwapRequest = { statusRequest: Status.Accepted };
    this.requestService.updateSwapRequest(request.requestId, updatedRequest).subscribe(
      () => {
        this.toast.success({ detail: "SUCCESS", summary: "Request accepted", duration: 3000 });
        const index = this.receivedSwapRequests.findIndex(r => r.requestId === request.requestId);
        if (index !== -1) {
          this.receivedSwapRequests[index].statusRequest = Status.Accepted;
        }
      },
      (error) => {
        console.error('Failed to accept request', error);
      }
    );
  }

  rejectRequest(request: GetSwapRequest) {
    const updatedRequest: UpdateSwapRequest = { statusRequest: Status.Rejected };
    this.requestService.updateSwapRequest(request.requestId, updatedRequest).subscribe(
      () => {
        this.toast.success({ detail: "SUCCESS", summary: "Request rejected", duration: 3000 });
        const index = this.receivedSwapRequests.findIndex(r => r.requestId === request.requestId);
        if (index !== -1) {
          this.receivedSwapRequests[index].statusRequest = Status.Rejected;
        }
      },
      (error) => {
        console.error('Failed to reject request', error);
      }
    );
  }

  deleteRequest(request: GetSwapRequest) {
    this.requestService.deleteSwapRequest(request.requestId).subscribe(
      () => {
        this.toast.success({ detail: "SUCCESS", summary: "Request cancelled", duration: 3000 });
        this.receivedSwapRequests = this.receivedSwapRequests.filter(r => r.requestId !== request.requestId);
        this.sentSwapRequests = this.sentSwapRequests.filter(r => r.requestId !== request.requestId);
      },
      (err) => {
        this.toast.error({ detail: "ERROR", summary: err.error.message, duration: 5000 });
      }
    );
  }

  getStatus(status: Status): string {
    switch (status) {
      case Status.Pending:
        return 'Pending';
      case Status.Accepted:
        return 'Accepted';
      case Status.Rejected:
        return 'Rejected';
      case Status.Invalid:
        return 'Invalid';
      default:
        return '';
    }
  }
}
